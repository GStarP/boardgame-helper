import * as FileSystem from "expo-file-system";

/**
 * consts
 */
export const PLUGIN_ROOT = FileSystem.documentDirectory + "plugins";
export const PLUGIN_DOWNLOAD_ROOT = FileSystem.documentDirectory + "tmp";

/**
 * utils
 */
export function getPluginDir(pluginId: string): string {
  return PLUGIN_ROOT + `/${pluginId}`;
}

export function getPluginEntry(pluginId: string): string {
  return PLUGIN_ROOT + `/${pluginId}/index.html`;
}

export function getPluginArchiveUri(pluginId: string): string {
  return `${PLUGIN_DOWNLOAD_ROOT}/${pluginId}.zip`;
}
