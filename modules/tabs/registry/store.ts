import { atom, getDefaultStore } from 'jotai'

import { PluginInfo } from '@/modules/tabs/home/store'

export type PluginDetail = PluginInfo & {
  pluginDesc: string
  pluginSrc: string
  pluginSize: string
}

export const j_ava_plugins = atom<PluginDetail[]>([])
export function setAvaPlugins(avaPlugins: PluginDetail[]) {
  getDefaultStore().set(j_ava_plugins, avaPlugins)
}
export const j_ava_loading = atom(false)

export const j_builtin_plugins = atom<string[]>([])
