import { atom, useAtom } from "jotai";
import { PluginInfo } from "./types";
import { logger } from "@/modules/logger";
import { createDirIfNeed } from "@/modules/common/fs";
import { PLUGIN_ROOT, getPluginDir } from "@/modules/plugin";
import * as FileSystem from 'expo-file-system'

export const j_plugins = atom<PluginInfo[]>([]);

export function usePlugins(): [PluginInfo[], () => Promise<void>] {
  const [plugins, setPlugins] = useAtom(j_plugins);
  const updatePlugins = async () => {
    try {
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
      setPlugins(plugins)
    } catch (e) {
      logger.error(`updatePlugins error: ${e}`)
    }
  }
  return [plugins, updatePlugins]
}