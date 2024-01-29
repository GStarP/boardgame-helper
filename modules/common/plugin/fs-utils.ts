import * as FileSystem from 'expo-file-system'

/**
 * const
 */
export const PLUGIN_ROOT = FileSystem.documentDirectory + 'plugins'
export const PLUGIN_DOWNLOAD_ROOT = FileSystem.cacheDirectory + 'plugins'

/**
 * utils
 */
export function getPluginDir(pluginId: string): string {
  return PLUGIN_ROOT + `/${pluginId}`
}

export function getPluginEntry(pluginId: string): string {
  return PLUGIN_ROOT + `/${pluginId}/dist/index.html`
}

export function getPluginArchiveUri(pluginId: string): string {
  return `${PLUGIN_DOWNLOAD_ROOT}/${pluginId}.tgz`
}

export function getPluginUnzipUri(pluginId: string): string {
  return `${PLUGIN_DOWNLOAD_ROOT}/${pluginId}`
}

// * pluginId will be used in path so `/` is not allowed
export function formatPluginId(rawPluginId: string): string {
  return rawPluginId.replaceAll(/\//g, SCOPE_SPLITTER)
}
const SCOPE_SPLITTER = '+'
