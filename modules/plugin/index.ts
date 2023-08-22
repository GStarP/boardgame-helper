
import * as FileSystem from "expo-file-system";

/**
 * consts
 */
export const PLUGIN_ROOT = FileSystem.documentDirectory + "plugins";

/**
 * utils
 */
export function getPluginDir(pluginId: string): string {
  return PLUGIN_ROOT + `/${pluginId}`;
}

export function getPluginEntry(pluginId: string): string {
  return PLUGIN_ROOT + `/${pluginId}/index.html`;
}
