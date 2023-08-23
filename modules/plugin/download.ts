import * as FileSystem from "expo-file-system";
import { logger } from "@/modules/logger";
import { unzip } from "react-native-zip-archive";
import { PLUGIN_ROOT, getPluginDir } from ".";
import { EventEmitter } from "@/modules/common/event";
import type { LoadPluginTaskEventMap } from "./types";
import { createDirIfNeed } from "@/modules/common/fs";
import { insertPlugin } from "./database";

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
  // @TODO mock
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

async function registerPlugin(pluginId: string): Promise<void> {
  const pluginDir = getPluginDir(pluginId)
  // get name from manifest.json
  const manifestStr = await FileSystem.readAsStringAsync(
    `${pluginDir}/manifest.json`
  );
  const pluginName: string = JSON.parse(manifestStr).name;
  // ge icon uri from icon.png
  const pluginIcon = (
    await FileSystem.getInfoAsync(`${pluginDir}/icon.png`)
  ).uri;

  await insertPlugin({
    pluginId,
    pluginName,
    pluginIcon,
  });
}

export class InstallPluginTask extends EventEmitter<LoadPluginTaskEventMap> {
  pluginId: string
  donwloadResumable: FileSystem.DownloadResumable

  constructor(pluginId: string, state?: FileSystem.DownloadPauseState) {
    super()
    this.pluginId = pluginId
    // register self callbacks
    const debugLog = (...args: any) => logger.debug(`[${this.pluginId}]`, ...args)
    this.on('downalod:start', (data) => debugLog('downalod:start', data))
    this.on('download:pause', (data) => debugLog('downalod:pause', data))
    this.on('download:finish', (data) => debugLog('downalod:finish', data))
    this.on('unzip:start', () => debugLog('unzip:start'))
    this.on('unzip:finish', () => debugLog('unzip:finish'))
    this.on('success', () => debugLog('success'))
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

  async run(): Promise<void> {
    try {
      // ensure plugin_download_root exists before download
      await createDirIfNeed(PLUGIN_DOWNLOAD_ROOT)
      this.emit('downalod:start', this.donwloadResumable.savable())
      const res = await this.donwloadResumable.downloadAsync()
      this.emit('download:finish', res)

      // ensure plugin_root exists before unzip
      await createDirIfNeed(PLUGIN_ROOT)
      this.emit('unzip:start')
      await unzipPlugin(this.pluginId)
      this.emit('unzip:finish')

      await registerPlugin(this.pluginId)

      this.emit('success')
    } catch (e) {
      this.emit("error", e)
    }
  }

  async pause(): Promise<FileSystem.DownloadPauseState> {
    const state = await this.donwloadResumable.pauseAsync()
    this.emit('download:pause', state)
    return state
  }

}