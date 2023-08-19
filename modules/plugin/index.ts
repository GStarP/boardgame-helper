import { PluginInfo } from "@/store/index/types";
import * as FileSystem from "expo-file-system";
import { logger } from "@/modules/logger";
import { createDirIfNeed } from "@/modules/common/fs";

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

export async function readPlugins(): Promise<PluginInfo[]> {
  await createDirIfNeed(PLUGIN_ROOT)

  const pluginIds = await FileSystem.readDirectoryAsync(PLUGIN_ROOT);
  const plugins: PluginInfo[] = [];
  for (const pluginId of pluginIds) {
    try {
      const pluginDir = getPluginDir(pluginId);
      // get name from manifest.json
      const manifestStr = await FileSystem.readAsStringAsync(
        `${pluginDir}/manifest.json`
      );
      const pluginName: string = JSON.parse(manifestStr).name;
      // ge icon uri from icon.png
      const pluginIcon = (
        await FileSystem.getInfoAsync(`${pluginDir}/icon.png`)
      ).uri;

      plugins.push({
        pluginId,
        pluginName,
        pluginIcon,
      });
    } catch (e) {
      // skip invalid plugin info
      logger.warn(`invalid plugin: pluginId=${pluginId}`);
      continue;
    }
  }

  return plugins;
}
