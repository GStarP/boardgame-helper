import { getDefaultStore } from 'jotai'

import { fetchPluginMetadata } from '@/data/network/plugin'
import { logger } from '@/libs/logger'
import { IMG_BASE64_HEADER } from '@/utils/const'
import { formatFileSize } from '@/utils/format'

import { PluginDetail, j_ava_loading, j_ava_plugins } from './store'

export async function batchUpdateAvaPlugins(pluginIds: string[]) {
  const store = getDefaultStore()
  try {
    store.set(j_ava_loading, true)
    const infos = await Promise.all(
      pluginIds.map((id) => fetchPluginMetadata(id))
    )
    const plugins: PluginDetail[] = infos.map((info) => ({
      version: info.version,
      pluginId: info.name,
      pluginName: info?.bgt?.name ?? 'Unknown',
      pluginIcon: info?.bgt?.icon ? IMG_BASE64_HEADER + info.bgt.icon : '',
      pluginDesc: info?.bgt?.desc ?? '',
      pluginSrc: info.dist.tarball,
      pluginSize: formatFileSize(info.dist.unpackedSize),
    }))
    store.set(j_ava_plugins, plugins)
  } catch (e) {
    logger.error('[batchUpdateAvaPlugins]', e)
  } finally {
    store.set(j_ava_loading, false)
  }
}
