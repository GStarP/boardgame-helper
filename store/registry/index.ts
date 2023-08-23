import { atom, useAtom } from "jotai";
import type { PluginDetail } from "./types";

export const j_ava_plugins = atom<PluginDetail[]>([])

// @TODO mock
export function useAvailablePlugins(): [PluginDetail[], () => Promise<void>] {
  const [availablePlugins, setAvailablePlugins] = useAtom(j_ava_plugins)
  const updateAvailablePlugins = async () => {
    setTimeout(() => {
      setAvailablePlugins([{
        pluginId: 'chwazi',
        pluginName: 'Chwazi',
        pluginIcon: '',
        pluginDesc: 'a random startup chosing plugin'
      }])
    }, 2000)
  }
  return [availablePlugins, updateAvailablePlugins]
}