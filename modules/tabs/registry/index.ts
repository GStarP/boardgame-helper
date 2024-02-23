import { getDefaultStore } from 'jotai'

import { fetchPluginMetadata } from '@/data/network/plugin'
import { logger } from '@/libs/logger'
import { IMG_BASE64_HEADER } from '@/utils/const'

import { PluginDetail, RegistryStore } from './store'

export async function batchUpdateAvaPlugins(pluginIds: string[]) {
  logger.info(`[batchUpdateAvaPlugins]: ${pluginIds}`)
  const store = getDefaultStore()
  try {
    store.set(RegistryStore.loading, true)
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
      pluginSize: info.dist.unpackedSize,
    }))
    store.set(RegistryStore.plugins, plugins)
  } catch (e) {
    logger.error('[batchUpdateAvaPlugins]', e)
  } finally {
    store.set(RegistryStore.loading, false)
  }
}
