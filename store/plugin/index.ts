import { atom, getDefaultStore } from 'jotai'
import type { PluginInfo, PluginDetail } from './types'

const store = getDefaultStore()

// installed plugins
export const j_plugins = atom<PluginInfo[]>([])
export function setPlugins(plugins: PluginInfo[]) {
  store.set(j_plugins, plugins)
}

// plugins from registry
export const j_ava_plugins = atom<PluginDetail[]>([])
export function setAvaPlugins(avaPlugins: PluginDetail[]) {
  store.set(j_ava_plugins, avaPlugins)
}
