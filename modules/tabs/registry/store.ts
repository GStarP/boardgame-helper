import { atom, getDefaultStore } from 'jotai'

import { PluginInfo } from '@/modules/tabs/home/store'

export type PluginDetail = PluginInfo & {
  pluginDesc: string
  pluginSrc: string
  pluginSize: number
}

const plugins = atom<PluginDetail[]>([])
const setPlugins = (v: PluginDetail[]) => {
  getDefaultStore().set(plugins, v)
}

const loading = atom(false)

const builtinPlugins = atom<string[]>([])
const setBuiltinPlugins = (v: string[]) => {
  getDefaultStore().set(builtinPlugins, v)
}

export const RegistryStore = {
  plugins,
  setPlugins,
  loading,
  builtinPlugins,
  setBuiltinPlugins,
}
