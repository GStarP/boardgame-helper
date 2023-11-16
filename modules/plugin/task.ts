import * as FileSystem from 'expo-file-system'
import { logger } from '@/modules/logger'
import { decompress } from '@gstarp/react-native-tgz'
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
    // cache => plugin archive not the latest
    {
      cache: false,
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
      if (data.totalBytesWritten >= data.totalBytesExpectedToWrite) {
        this.emit('download:finish')
      }
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
      // @ATT pause will also cause downloadPromise to resolve
      // so we must do pro-process when download is real finished
      const installAfterDownload = async () => {
        this.removeListener('download:finish', installAfterDownload)
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
          this.setState(InstallTaskState.SUCCESS)
        } catch (e) {
          this.emit('error', e)
          this.setState(InstallTaskState.ERROR)
        }
      }
      this.on('download:finish', installAfterDownload)

      if (this.state === InstallTaskState.WAITING) {
        // ensure plugin_download_root exists before downloading
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
    await decompress(pluginArchiveUri, pluginUnzipDir)

    try {
      if ((await FileSystem.getInfoAsync(pluginDir)).exists) {
        await FileSystem.deleteAsync(pluginDir)
      }
    } catch (e) {
      logger.warn(e)
    }

    logger.info(`movePluginDir: from=${pluginUnzipDir}, to=${pluginDir}`)
    await FileSystem.moveAsync({
      // @ATT .tgz from npm registry includes an extra package dir
      from: pluginUnzipDir + '/package',
      to: pluginDir,
    })
    await FileSystem.deleteAsync(pluginUnzipDir)
  }

  private async registerPlugin(): Promise<void> {
    const pluginDir = getPluginDir(this.plugin.pluginId)
    const pluginName = this.plugin.pluginName

    // get icon uri from icon.png
    const pluginIcon = (await FileSystem.getInfoAsync(`${pluginDir}/icon.png`))
      .uri

    await insertPlugin({
      pluginId: this.plugin.pluginId,
      pluginName,
      pluginIcon,
    })
  }
}
