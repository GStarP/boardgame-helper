import * as FileSystem from 'expo-file-system'
import type { DownloadPauseState } from 'expo-file-system'
import { getDefaultStore } from 'jotai'
import { ToastAndroid } from 'react-native'

import {
  deletePlugin,
  getAllPlugins,
  getBuiltinPlugins,
  insertBuiltinPlugins,
} from '@/data/database/plugin'
import { fetchPluginMetadata } from '@/data/network/plugin'
import i18n from '@/i18n'
import { i18nKeys } from '@/i18n/keys'
import { logger } from '@/plugins/logger'
import { j_builtin_plugins, setPlugins } from '@/store/plugin'
import type { PluginDetail } from '@/store/plugin/types'

import { addTask, removeTask, watchInstallState } from '../download/biz'
import { j_install_task_map } from '../download/store'
import { InstallTask } from './task'
import { TaskSavableDecorator } from './task/savable'
import { getPluginDir } from './util'

export async function updatePlugins() {
  const plugins = await getAllPlugins()
  setPlugins(plugins)
}

export function installPlugin(
  plugin: PluginDetail,
  savable?: DownloadPauseState
) {
  // if task already exists, return
  if (getDefaultStore().get(j_install_task_map).has(plugin.pluginId)) {
    return
  }
  let task = new InstallTask(plugin, savable)
  task = TaskSavableDecorator(task)
  watchInstallState(task)
  addTask(task)

  task.on('success', async () => {
    await updatePlugins()
    ToastAndroid.show(
      `${plugin.pluginName} ${i18n.t(i18nKeys.TOAST_INSTALL_SUCCESS)}`,
      ToastAndroid.SHORT
    )
  })
  task.on(['success', 'cancel'], () => {
    removeTask(task.plugin.pluginId)
  })
  task.run()
  return task
}

export async function uninstallPlugin(pluginId: string): Promise<void> {
  logger.debug(`uninstallPlugin: ${pluginId}`)
  const p1 = deletePlugin(pluginId)
  const p2 = FileSystem.deleteAsync(getPluginDir(pluginId))
  await Promise.all([p1, p2])
  await updatePlugins()
}

export function initBuiltinPlugins() {
  getBuiltinPlugins().then((plugins) => {
    getDefaultStore().set(j_builtin_plugins, plugins)
  })
}

export async function addBuiltinPlugins(pluginPackageName: string) {
  try {
    const metadata = await fetchPluginMetadata(pluginPackageName)
    if (!metadata.bgt) {
      ToastAndroid.show(
        i18n.t(i18nKeys.TOAST_INVALID_PLUGIN),
        ToastAndroid.SHORT
      )
      return
    }

    const plugins = await insertBuiltinPlugins(pluginPackageName)
    getDefaultStore().set(j_builtin_plugins, plugins)
  } catch (e) {
    if (e instanceof Error && e.message === i18nKeys.COMMON_ALREADY_EXISTS) {
      ToastAndroid.show(
        `${pluginPackageName} ${i18n.t(i18nKeys.COMMON_ALREADY_EXISTS)}`,
        ToastAndroid.SHORT
      )
    } else {
      ToastAndroid.show(
        i18n.t(i18nKeys.TOAST_INVALID_PLUGIN),
        ToastAndroid.SHORT
      )
      logger.error(e)
    }
  }
}
