import { j_ava_loading, j_ava_plugins } from '@/store/plugin'
import { getDefaultStore } from 'jotai'
import { fetchPluginMetadata } from '@/api/plugin'
import { PluginDetail } from '@/store/plugin/types'
import { logger } from '@/modules/logger'
import { formatPluginId } from '@/modules/plugin/util'

export const BUILT_IN_PLUGIN_LIST = ['@board-game-toolbox/plugin-template']

export async function batchUpdateAvaPlugins(pluginIds: string[]) {
  const store = getDefaultStore()
  try {
    store.set(j_ava_loading, true)
    const infos = await Promise.all(
      pluginIds.map((id) => fetchPluginMetadata(id))
    )
    const plugins: PluginDetail[] = infos.map((info) => ({
      pluginId: formatPluginId(info.name),
      // @TODO need extra field
      pluginName: info.name.replace(/^@\S+\//, ''),
      // @TODO need extra field
      pluginIcon: '',
      pluginDesc: info.description,
      pluginSrc: info.dist.tarball,
    }))
    store.set(j_ava_plugins, plugins)
  } catch (e) {
    logger.error('[batchUpdateAvaPlugins]', e)
  } finally {
    store.set(j_ava_loading, false)
  }
}
