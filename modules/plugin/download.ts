
import * as FileSystem from "expo-file-system";
import { logger } from "@/modules/logger";
import { unzip } from "react-native-zip-archive";
import { getPluginDir } from ".";
import { EventEmitter } from "@/modules/common/event";
import { LoadPluginTaskEventMap } from "./types";
import { createDirIfNeed } from "@/modules/common/fs";

/**
 * consts
 */
export const PLUGIN_DOWNLOAD_ROOT = FileSystem.documentDirectory + "tmp";

/**
 * utils
 */
export function getPluginArchiveUri(pluginId: string): string {
  return `${PLUGIN_DOWNLOAD_ROOT}/${pluginId}.zip`
}

function createPluginDownloadResumable(pluginId: string, handler: (data: LoadPluginTaskEventMap['download:progress']) => void): FileSystem.DownloadResumable {
  // @TEST
  const baseUrl = 'http://localhost:8000/plugins'

  const downloadUrl = `${baseUrl}/${pluginId}.zip`
  const localUri = getPluginArchiveUri(pluginId)

  return FileSystem.createDownloadResumable(downloadUrl, localUri, {
    cache: true
  }, handler)
}

async function unzipPlugin(pluginId: string): Promise<void> {
  const pluginArchiveUri = getPluginArchiveUri(pluginId)
  const pluginDir = getPluginDir(pluginId)

  logger.info(`unzipPlugin: from=${pluginArchiveUri}, to=${pluginDir}`)

  // @FIX should delete when new assets ready to replace
  if ((await FileSystem.getInfoAsync(pluginDir)).exists) {
    await FileSystem.deleteAsync(pluginDir)
  }

  await unzip(pluginArchiveUri, pluginDir)
}

export class InstallPluginTask extends EventEmitter<LoadPluginTaskEventMap> {
  pluginId: string
  donwloadResumable: FileSystem.DownloadResumable

  constructor(pluginId: string, state?: FileSystem.DownloadPauseState) {
    super()
    this.pluginId = pluginId
    // register self callbacks
    this.on('downalod:start', (data) => logger.debug('downalod:start', data))
    this.on('download:pause', (data) => logger.debug('downalod:pause', data))
    this.on('download:finish', (data) => logger.debug('downalod:finish', data))
    this.on('unzip:start', () => logger.debug('unzip:start'))
    this.on('unzip:finish', () => logger.debug('unzip:finish'))
    this.on('error', (e) => logger.error(e))
    // create DownloadResumable
    const onProgress = (data: LoadPluginTaskEventMap['download:progress']) => {
      this.emit('download:progress', data)
    }
    if (state) {
      this.donwloadResumable = FileSystem.createDownloadResumable(
        state.url, state.fileUri, state.options, onProgress, state.resumeData
      )
    } else {
      this.donwloadResumable = createPluginDownloadResumable(this.pluginId, onProgress)
    }
  }

  run(): InstallPluginTask {
    // cannot download until dir created
    createDirIfNeed(PLUGIN_DOWNLOAD_ROOT).then(() => {
      this.emit('downalod:start', this.donwloadResumable.savable())
      this.donwloadResumable.downloadAsync()
        .then((res) => {
          this.emit('download:finish', res)
        })
        .then(async () => {
          this.emit('unzip:start')
          await unzipPlugin(this.pluginId)
          this.emit('unzip:finish')
        })
        .catch(e => this.emit("error", e))
    })

    return this
  }

  pause(): Promise<FileSystem.DownloadPauseState> {
    const promise = this.donwloadResumable.pauseAsync()

    promise.then(state => {
      this.emit('download:pause', state)
      return state
    })

    promise.catch(e => this.emit('error', e))

    return promise
  }

}

export function installPlugin(pluginId: string): InstallPluginTask {
  return new InstallPluginTask(pluginId).run()
}