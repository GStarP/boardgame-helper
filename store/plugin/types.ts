export interface PluginInfo {
  version: string
  pluginId: string
  pluginName: string
  pluginIcon: string
}

export interface PluginDetail extends PluginInfo {
  pluginDesc: string
  pluginSrc: string
  pluginSize: string
}
