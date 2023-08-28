import { atom, getDefaultStore } from "jotai";
import type { PluginInfo } from "./types";
import { logger } from "@/modules/logger";
import { getAllPlugins } from "@/modules/plugin/database";

export const j_plugins = atom<PluginInfo[]>([]);

export async function updatePlugins(): Promise<void> {
  try {
    const plugins = await getAllPlugins()
    getDefaultStore().set(j_plugins, plugins)
  } catch (e) {
    logger.error(`updatePlugins: ${e}`)
  }
}