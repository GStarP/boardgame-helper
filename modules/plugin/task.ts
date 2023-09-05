import * as FileSystem from 'expo-file-system'
import { logger } from '@/modules/logger'
import { unzip } from 'react-native-zip-archive'
import {
  PLUGIN_DOWNLOAD_ROOT,
  PLUGIN_ROOT,
  getPluginArchiveUri,
  getPluginDir,
  getPluginUnzipUri,
} from './util'
import { EventEmitter } from '@/modules/common/event'
import { InstallTaskState, LoadPluginTaskEventMap } from './types'
import { createDirIfNeed } from '@/modules/common/fs'
import type { PluginInfo } from '@/store/plugin/types'
import { insertPlugin } from '@/api/plugin/db'

function initDownloadResumable(
  pluginId: string,
  handler: (data: LoadPluginTaskEventMap['download:progress']) => void
): FileSystem.DownloadResumable {
  // @TODO mock
  const baseUrl = 'http://localhost:8000/plugins'

  const downloadUrl = `${baseUrl}/${pluginId}.zip`
  const localUri = getPluginArchiveUri(pluginId)

  return FileSystem.createDownloadResumable(
    downloadUrl,
    localUri,
    {
      cache: true,
    },
    handler
  )
}

async function unzipPlugin(pluginId: string): Promise<void> {
  const pluginArchiveUri = getPluginArchiveUri(pluginId)
  const pluginUnzipDir = getPluginUnzipUri(pluginId)
  const pluginDir = getPluginDir(pluginId)

  logger.info(`unzipPlugin: from=${pluginArchiveUri}, to=${pluginUnzipDir}`)
  await unzip(pluginArchiveUri, pluginUnzipDir)

  if ((await FileSystem.getInfoAsync(pluginDir)).exists) {
    await FileSystem.deleteAsync(pluginDir)
  }

  logger.info(`movePluginDir: from=${pluginUnzipDir}, to=${pluginDir}`)
  await FileSystem.moveAsync({
    from: pluginUnzipDir,
    to: pluginDir,
  })
}

async function registerPlugin(pluginId: string): Promise<void> {
  const pluginDir = getPluginDir(pluginId)
  // get name from manifest.json
  const manifestStr = await FileSystem.readAsStringAsync(
    `${pluginDir}/manifest.json`
  )
  const pluginName: string = JSON.parse(manifestStr).name
  // ge icon uri from icon.png
  const pluginIcon = (await FileSystem.getInfoAsync(`${pluginDir}/icon.png`))
    .uri

  await insertPlugin({
    pluginId,
    pluginName,
    pluginIcon,
  })
}

export class InstallTask extends EventEmitter<LoadPluginTaskEventMap> {
  plugin: PluginInfo
  donwloadResumable: FileSystem.DownloadResumable
  state: InstallTaskState

  constructor(plugin: PluginInfo, state?: FileSystem.DownloadPauseState) {
    super()
    this.plugin = plugin
    // debug callbacks
    const debugLog = (...args: any) =>
      logger.debug(`[${this.plugin.pluginId}]`, ...args)
    this.on('download:start', (data) => debugLog('download:start', data))
    this.on('download:pause', (data) => debugLog('download:pause', data))
    this.on('download:resume', (data) => debugLog('download:resume', data))
    this.on('download:finish', (data) => debugLog('download:finish', data))
    this.on('unzip:start', () => debugLog('unzip:start'))
    this.on('unzip:finish', () => debugLog('unzip:finish'))
    this.on('success', () => debugLog('success'))
    this.on('cancel', () => debugLog('cancel'))
    this.on('error', (e) => logger.error(e))
    this.on('state:change', (curState) => debugLog('state:change', curState))
    // create DownloadResumable
    const onProgress = (data: LoadPluginTaskEventMap['download:progress']) => {
      this.emit('download:progress', data)
    }
    if (state) {
      this.donwloadResumable = FileSystem.createDownloadResumable(
        state.url,
        state.fileUri,
        state.options,
        onProgress,
        state.resumeData
      )
    } else {
      this.donwloadResumable = initDownloadResumable(
        this.plugin.pluginId,
        onProgress
      )
    }

    this.state = InstallTaskState.WAITING
  }

  private setState(state: InstallTaskState): void {
    this.state = state
    this.emit('state:change', state)
  }

  async run(): Promise<void> {
    try {
      let downloadPromise: Promise<
        FileSystem.FileSystemDownloadResult | undefined
      >
      if (this.state === InstallTaskState.WAITING) {
        // ensure plugin_download_root exists before download
        await createDirIfNeed(PLUGIN_DOWNLOAD_ROOT)
        this.emit('download:start', this.donwloadResumable.savable())
        downloadPromise = this.donwloadResumable.downloadAsync()
      } else if (
        this.state === InstallTaskState.PAUSED ||
        this.state === InstallTaskState.ERROR
      ) {
        this.emit('download:resume', this.donwloadResumable.savable())
        downloadPromise = this.donwloadResumable.resumeAsync()
      } else {
        throw new Error(`invalid state to run: ${this.state}`)
      }
      this.setState(InstallTaskState.DOWNLOADING)
      const res = await downloadPromise
      this.emit('download:finish', res)

      // ensure plugin_root exists before unzip
      await createDirIfNeed(PLUGIN_ROOT)
      this.emit('unzip:start')
      this.setState(InstallTaskState.UNZIPPING)
      await unzipPlugin(this.plugin.pluginId)
      this.emit('unzip:finish')

      this.emit('register:start')
      this.setState(InstallTaskState.REGISTERING)
      await registerPlugin(this.plugin.pluginId)
      this.emit('register:finish')

      this.emit('success')
      this.setState(InstallTaskState.FINISH)
    } catch (e) {
      this.emit('error', e)
      this.setState(InstallTaskState.ERROR)
    }
  }

  async pause(): Promise<FileSystem.DownloadPauseState> {
    const state = await this.donwloadResumable.pauseAsync()
    this.emit('download:pause', state)
    this.setState(InstallTaskState.PAUSED)
    return state
  }

  async cancel(): Promise<void> {
    await this.donwloadResumable.cancelAsync()
    this.emit('cancel')
    this.setState(InstallTaskState.FINISH)
  }
}
