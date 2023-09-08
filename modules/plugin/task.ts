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
import { InstallTaskState, InstallTaskEventMap } from './types'
import { createDirIfNeed } from '@/modules/common/fs'
import type { PluginDetail } from '@/store/plugin/types'
import { insertPlugin } from '@/api/plugin/db'

function createDownloadResumable(
  plugin: PluginDetail,
  handler: (data: InstallTaskEventMap['download:progress']) => void
): FileSystem.DownloadResumable {
  const downloadUrl = plugin.pluginSrc
  const localUri = getPluginArchiveUri(plugin.pluginId)

  return FileSystem.createDownloadResumable(
    downloadUrl,
    localUri,
    {
      cache: true,
    },
    handler
  )
}

export class InstallTask extends EventEmitter<InstallTaskEventMap> {
  plugin: PluginDetail
  downloadResumable: FileSystem.DownloadResumable
  state: InstallTaskState

  constructor(plugin: PluginDetail, state?: FileSystem.DownloadPauseState) {
    super()
    this.plugin = plugin
    // debug callbacks
    const debugLog = (...args: any) =>
      logger.debug(`InstallTask[${this.plugin.pluginId}]`, ...args)
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
    const onProgress = (data: InstallTaskEventMap['download:progress']) => {
      this.emit('download:progress', data)
    }
    if (state) {
      this.downloadResumable = FileSystem.createDownloadResumable(
        state.url,
        state.fileUri,
        state.options,
        onProgress,
        state.resumeData
      )
    } else {
      this.downloadResumable = createDownloadResumable(this.plugin, onProgress)
    }

    this.state = InstallTaskState.WAITING
  }

  /**
   * public methods
   */
  async run(): Promise<void> {
    try {
      let downloadPromise: Promise<
        FileSystem.FileSystemDownloadResult | undefined
      >
      if (this.state === InstallTaskState.WAITING) {
        // ensure plugin_download_root exists before downloading
        await createDirIfNeed(PLUGIN_DOWNLOAD_ROOT)
        this.emit('download:start', this.downloadResumable.savable())
        downloadPromise = this.downloadResumable.downloadAsync()
      } else if (
        this.state === InstallTaskState.PAUSED ||
        this.state === InstallTaskState.ERROR
      ) {
        this.emit('download:resume', this.downloadResumable.savable())
        downloadPromise = this.downloadResumable.resumeAsync()
      } else {
        throw new Error(`invalid state to run: ${this.toString()}`)
      }
      this.setState(InstallTaskState.DOWNLOADING)
      const res = await downloadPromise
      this.emit('download:finish', res)

      // ensure plugin_root exists before unzip
      await createDirIfNeed(PLUGIN_ROOT)
      this.emit('unzip:start')
      this.setState(InstallTaskState.UNZIPPING)
      await this.unzipPlugin()
      this.emit('unzip:finish')

      this.emit('register:start')
      this.setState(InstallTaskState.REGISTERING)
      await this.registerPlugin()
      this.emit('register:finish')

      this.emit('success')
      this.setState(InstallTaskState.SUCCESS)
    } catch (e) {
      this.emit('error', e)
      this.setState(InstallTaskState.ERROR)
    }
  }

  async pause(): Promise<FileSystem.DownloadPauseState> {
    const state = await this.downloadResumable.pauseAsync()
    this.emit('download:pause', state)
    this.setState(InstallTaskState.PAUSED)
    return state
  }

  async cancel(): Promise<void> {
    await this.downloadResumable.cancelAsync()
    this.emit('cancel')
    this.setState(InstallTaskState.SUCCESS)
  }

  toString(): string {
    return `InstallTask[${this.plugin.pluginId}](state=${
      this.state
    })(downloadResumable=${JSON.stringify(this.downloadResumable.savable())})`
  }

  /**
   * private methods
   */
  private setState(state: InstallTaskState): void {
    this.state = state
    this.emit('state:change', state)
  }

  private async unzipPlugin(): Promise<void> {
    const pluginId = this.plugin.pluginId
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

  async registerPlugin(): Promise<void> {
    const pluginDir = getPluginDir(this.plugin.pluginId)
    // get name from manifest.json
    const manifestStr = await FileSystem.readAsStringAsync(
      `${pluginDir}/manifest.json`
    )
    const pluginName: string = JSON.parse(manifestStr).name
    // ge icon uri from icon.png
    const pluginIcon = (await FileSystem.getInfoAsync(`${pluginDir}/icon.png`))
      .uri

    await insertPlugin({
      pluginId: this.plugin.pluginId,
      pluginName,
      pluginIcon,
    })
  }
}
