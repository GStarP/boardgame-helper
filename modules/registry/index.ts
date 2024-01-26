import { getDefaultStore } from 'jotai'

import { fetchPluginMetadata } from '@/data/network/plugin'
import { IMG_BASE64_HEADER } from '@/modules/common/const'
import { formatFileSize } from '@/modules/common/format'
import { logger } from '@/modules/logger'
import { formatPluginId } from '@/modules/plugin/util'
import { j_ava_loading, j_ava_plugins } from '@/store/plugin'
import { PluginDetail } from '@/store/plugin/types'

export async function batchUpdateAvaPlugins(pluginIds: string[]) {
  const store = getDefaultStore()
  try {
    store.set(j_ava_loading, true)
    const infos = await Promise.all(
      pluginIds.map((id) => fetchPluginMetadata(id))
    )
    const plugins: PluginDetail[] = infos.map((info) => ({
      version: info.version,
      pluginId: formatPluginId(info.name),
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
