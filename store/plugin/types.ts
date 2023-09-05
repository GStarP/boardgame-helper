export interface PluginInfo {
  pluginId: string
  pluginName: string
  pluginIcon: string
}

export interface PluginDetail extends PluginInfo {
  pluginDesc: string
}
