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
import { logger } from '@/libs/logger'
import { watchInstallState } from '@/modules/download/biz'
import {
  addInstallTask,
  j_install_task_map,
  removeInstallTask,
} from '@/modules/download/store'
import { setPlugins } from '@/modules/tabs/home/store'
import { PluginDetail, j_builtin_plugins } from '@/modules/tabs/registry/store'

import { getPluginDir } from './fs-utils'
import { InstallTask } from './install-task'
import { TaskSavableDecorator } from './install-task.savable'

export async function updatePlugins() {
  setPlugins(await getAllPlugins())
}

export function installPlugin(
  plugin: PluginDetail,
  savable?: DownloadPauseState
): InstallTask | undefined {
  logger.info(
    'installPlugin',
    plugin.pluginId,
    savable ? JSON.stringify(savable) : ''
  )
  // if task already exists, return
  if (getDefaultStore().get(j_install_task_map).has(plugin.pluginId)) {
    return
  }

  let task = new InstallTask(plugin, savable)
  // TODO: should be toggled in settings
  task = TaskSavableDecorator(task)
  watchInstallState(task)

  addInstallTask(task)

  task.on('success', () => {
    ToastAndroid.show(
      `${plugin.pluginName} ${i18n.t(i18nKeys.TOAST_INSTALL_SUCCESS)}`,
      ToastAndroid.SHORT
    )
    updatePlugins()
  })
  task.once(['success', 'cancel'], () => {
    removeInstallTask(task.plugin.pluginId)
  })

  task.run()

  return task
}

export async function uninstallPlugin(pluginId: string): Promise<void> {
  logger.info('uninstallPlugin', pluginId)
  await deletePlugin(pluginId)
  await FileSystem.deleteAsync(getPluginDir(pluginId))
  await updatePlugins()
}

export async function initBuiltinPlugins() {
  getDefaultStore().set(j_builtin_plugins, await getBuiltinPlugins())
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
