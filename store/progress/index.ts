import { atom, getDefaultStore } from 'jotai'
import type { InstallTask } from '@/modules/plugin/task'
import { atomFamily } from 'jotai/utils'
import { InstallTaskProgress } from './types'
import { InstallTaskState } from '@/modules/plugin/types'
import { arrayAfterRemove } from '@/modules/common/array'

const store = getDefaultStore()

// use pluginId to query task progress atom
export const j_task_progress_family = atomFamily((pluginId: string) =>
  atom<InstallTaskProgress>({
    pluginId,
    state: InstallTaskState.WAITING,
    size: 0,
    targetSize: 0,
  })
)
export function setTaskProgress(
  pluginId: string,
  progress: Partial<InstallTaskProgress>
) {
  store.set(j_task_progress_family(pluginId), (pre) => ({
    ...pre,
    ...progress,
  }))
}

// the only store for InstallTask
export const taskMap = new Map<string, InstallTask>()
// store task.pluginId
export const j_tasks = atom<string[]>([])

export function addTask(task: InstallTask) {
  const id = task.plugin.pluginId
  if (taskMap.has(id)) return
  taskMap.set(task.plugin.pluginId, task)
  store.set(j_tasks, (pre) => [...pre, task.plugin.pluginId])
}

export function removeTask(pluginId: string) {
  if (!taskMap.has(pluginId)) return
  taskMap.delete(pluginId)
  store.set(j_tasks, (pre) => arrayAfterRemove(pre, (id) => id === pluginId))
}
