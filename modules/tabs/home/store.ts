import { atom, getDefaultStore } from 'jotai'

export type PluginInfo = {
  version: string
  pluginId: string
  pluginName: string
  pluginIcon: string
}

export const j_plugins = atom<PluginInfo[]>([])
export function setPlugins(plugins: PluginInfo[]) {
  getDefaultStore().set(j_plugins, plugins)
}
