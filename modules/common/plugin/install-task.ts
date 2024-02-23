import { decompress } from '@gstarp/react-native-tgz'
import * as FileSystem from 'expo-file-system'

import { insertPlugin } from '@/data/database/plugin'
import { logger } from '@/libs/logger'
import { PluginDetail } from '@/modules/tabs/registry/store'
import { IS_DEV } from '@/utils/const'
import { EventEmitter } from '@/utils/event'
import { createDirIfNeed } from '@/utils/fs'

import {
  PLUGIN_DOWNLOAD_ROOT,
  PLUGIN_ROOT,
  getPluginArchiveUri,
  getPluginDir,
  getPluginUnzipUri,
} from './fs-utils'
import { InstallTaskEventMap, InstallTaskState } from './install-task.type'

function createDownloadResumable(
  plugin: PluginDetail,
  handler: (data: InstallTaskEventMap['download:progress']) => void
): FileSystem.DownloadResumable {
  const downloadUrl = plugin.pluginSrc
  const localUri = getPluginArchiveUri(plugin.pluginId)

  return FileSystem.createDownloadResumable(
    downloadUrl,
    localUri,
    // true => plugin archive not the latest
    {
      cache: false,
    },
    handler
  )
}

export class InstallTask extends EventEmitter<InstallTaskEventMap> {
  plugin: PluginDetail
  downloadResumable: FileSystem.DownloadResumable
  state = InstallTaskState.WAITING

  constructor(plugin: PluginDetail, state?: FileSystem.DownloadPauseState) {
    super()
    this.plugin = plugin

    // attach listeners
    if (IS_DEV) {
      const debugLog = (...args: unknown[]) =>
        logger.debug(`InstallTask[${this.plugin.pluginId}]`, ...args)
      this.on('download:start', (data) => debugLog('download:start', data))
      this.on('download:pause', (data) => debugLog('download:pause', data))
      this.on('download:resume', (data) => debugLog('download:resume', data))
      this.on('download:finish', (data) => debugLog('download:finish', data))
      this.on('unzip:start', () => debugLog('unzip:start'))
      this.on('unzip:finish', () => debugLog('unzip:finish'))
      this.on('success', () => debugLog('success'))
      this.on('cancel', () => debugLog('cancel'))
      this.on('state:change', (curState) => debugLog('state:change', curState))
    }

    this.on('error', (e) => logger.error(e))

    const onProgress = (data: InstallTaskEventMap['download:progress']) => {
      this.emit('download:progress', data)
      if (data.totalBytesWritten >= data.totalBytesExpectedToWrite) {
        this.emit('download:finish')
      }
    }

    // recover from savable, or start a new download
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
  }

  static canRun(state: InstallTaskState): boolean {
    return (
      [
        InstallTaskState.WAITING,
        InstallTaskState.PAUSED,
        InstallTaskState.ERROR,
      ].indexOf(state) !== -1
    )
  }

  static canPause(state: InstallTaskState): boolean {
    return state === InstallTaskState.DOWNLOADING
  }

  /**
   * public methods
   */
  async run(): Promise<void> {
    try {
      // * pause will also cause downloadPromise to resolve
      // * so we should install when download is really finished
      this.once('download:finish', async () => {
        try {
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
          this.setState(InstallTaskState.FINISHED)
        } catch (e) {
          this.emit('error', e)
          this.setState(InstallTaskState.ERROR)
        }
      })

      if (this.state === InstallTaskState.WAITING) {
        // ensure plugin download dir exists
        await createDirIfNeed(PLUGIN_DOWNLOAD_ROOT)
        this.emit('download:start', this.downloadResumable.savable())
        this.downloadResumable.downloadAsync()
      } else if (
        this.state === InstallTaskState.PAUSED ||
        this.state === InstallTaskState.ERROR
      ) {
        this.emit('download:resume', this.downloadResumable.savable())
        this.downloadResumable.resumeAsync()
      } else {
        throw new Error(`invalid state to run: ${this.toString()}`)
      }
      this.setState(InstallTaskState.DOWNLOADING)
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
    this.setState(InstallTaskState.FINISHED)
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

    logger.info(`unzip: from=${pluginArchiveUri}, to=${pluginUnzipDir}`)
    await decompress(pluginArchiveUri, pluginUnzipDir)

    // if already installed, just replace it
    if ((await FileSystem.getInfoAsync(pluginDir)).exists) {
      await FileSystem.deleteAsync(pluginDir)
    }

    logger.info(`move: from=${pluginUnzipDir}, to=${pluginDir}`)
    await FileSystem.moveAsync({
      // * unzipped `.tgz` from npm registry includes an extra `package` dir
      from: pluginUnzipDir + '/package',
      to: pluginDir,
    })

    // delete unzipped temp dir
    await FileSystem.deleteAsync(pluginUnzipDir)
  }

  private async registerPlugin(): Promise<void> {
    // get icon uri from icon.png
    const pluginDir = getPluginDir(this.plugin.pluginId)
    const pluginIcon = (await FileSystem.getInfoAsync(`${pluginDir}/icon.png`))
      .uri

    await insertPlugin({
      version: this.plugin.version,
      pluginId: this.plugin.pluginId,
      pluginName: this.plugin.pluginName,
      pluginIcon,
    })
  }
}
