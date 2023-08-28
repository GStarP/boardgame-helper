import { atom, getDefaultStore } from "jotai";
import type { PluginDetail } from "./types";

export const j_ava_plugins = atom<PluginDetail[]>([])

// @TODO mock
export async function updateAvailablePlugins(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      getDefaultStore().set(j_ava_plugins, [{
        pluginId: 'chwazi',
        pluginName: 'Chwazi',
        pluginIcon: '',
        pluginDesc: 'a random startup chosing plugin'
      }])
      resolve()
    }, 1000)
  })
}