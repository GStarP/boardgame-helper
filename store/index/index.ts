import { atom, useAtomValue, useSetAtom } from "jotai";
import type { PluginInfo } from "./types";
import { logger } from "@/modules/logger";
import { getAllPlugins } from "@/modules/plugin/database";

type UpdatePluginsFunc = () => Promise<void>

export const j_plugins = atom<PluginInfo[]>([]);

export function usePlugins(): [PluginInfo[], UpdatePluginsFunc] {
  const plugins = useAtomValue(j_plugins);
  const updatePlugins = useUpdatePlugins()
  return [plugins, updatePlugins]
}

export function useUpdatePlugins(): UpdatePluginsFunc {
  const setPlugins = useSetAtom(j_plugins)
  const updatePlugins = async () => {
    try {
      const plugins = await getAllPlugins()
      setPlugins(plugins)
    } catch (e) {
      logger.error(`updatePlugins: ${e}`)
    }
  }
  return updatePlugins
}