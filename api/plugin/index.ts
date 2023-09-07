import type { PluginDetail } from '@/store/plugin/types'
import axios, { Res } from '@/api'

export async function fetchAvailablePlugins(): Promise<PluginDetail[]> {
  const { data: res } = await axios.get<Res<PluginDetail[]>>('/plugin/all')
  // @TODO axios interceptor
  if (res.data !== undefined) return res.data
  else throw Error(res.msg)
}
