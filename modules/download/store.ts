import produce from 'immer'
import { atom, getDefaultStore } from 'jotai'

import type { InstallTask } from '@/modules/common/plugin/install-task'
import { InstallTaskState } from '@/modules/common/plugin/install-task.type'

export type InstallStatus = {
  state: InstallTaskState
  size: number
  totalSize: number
}

const installTaskMap = atom<Map<string, InstallTask>>(new Map())

const installTaskStatusMap = atom<Map<string, InstallStatus>>(new Map())

const addInstallTask = (task: InstallTask) => {
  const store = getDefaultStore()

  if (store.get(installTaskMap).has(task.plugin.pluginId)) return

  store.set(
    installTaskMap,
    produce((tasks) => {
      tasks.set(task.plugin.pluginId, task)
    })
  )
}
const removeInstallTask = (pluginId: string) => {
  const store = getDefaultStore()

  if (!store.get(installTaskMap).has(pluginId)) return

  store.set(
    installTaskMap,
    produce((tasks) => {
      tasks.delete(pluginId)
    })
  )
}

export const DownloadStore = {
  installTaskMap,
  installTaskStatusMap,
  addInstallTask,
  removeInstallTask,
}
