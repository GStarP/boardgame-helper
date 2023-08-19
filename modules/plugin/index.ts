import { PluginInfo } from "@/store/index/types";
import { PLUGIN_DIR } from "./const";
import * as FileSystem from "expo-file-system";
import { logger } from "../logger";

export { PLUGIN_DIR } from "./const";

export function getPluginDir(pluginId: string): string {
  return PLUGIN_DIR + `/${pluginId}`;
}

export function getPluginEntry(pluginId: string): string {
  return PLUGIN_DIR + `/${pluginId}/index.html`;
}

/**
 * @throws FileSystem.readDirectoryAsync
 */
export async function readPlugins(): Promise<PluginInfo[]> {
  const pluginIds = await FileSystem.readDirectoryAsync(PLUGIN_DIR);
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
