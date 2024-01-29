import produce from 'immer'
import { atom, getDefaultStore } from 'jotai'

import type { InstallTask } from '@/modules/common/plugin/install-task'
import { InstallTaskState } from '@/modules/common/plugin/install-task.type'

export const j_install_task_map = atom<Map<string, InstallTask>>(new Map())

export type InstallStats = {
  state: InstallTaskState
  size: number
  totalSize: number
}
export const j_install_stats_map = atom<Map<string, InstallStats>>(new Map())

export function addInstallTask(task: InstallTask) {
  const store = getDefaultStore()

  if (store.get(j_install_task_map).has(task.plugin.pluginId)) return

  store.set(
    j_install_task_map,
    produce((tasks) => {
      tasks.set(task.plugin.pluginId, task)
    })
  )
}
export function removeInstallTask(pluginId: string) {
  const store = getDefaultStore()

  if (!store.get(j_install_task_map).has(pluginId)) return

  store.set(
    j_install_task_map,
    produce((tasks) => {
      tasks.delete(pluginId)
    })
  )
}
