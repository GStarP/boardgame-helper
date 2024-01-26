import produce from 'immer'
import { getDefaultStore } from 'jotai'

import { InstallTask } from '../plugin/task'
import { InstallTaskEventMap, InstallTaskState } from '../plugin/types'
import { j_install_stats_map, j_install_task_map } from './store'

export function addTask(task: InstallTask) {
  const store = getDefaultStore()

  if (store.get(j_install_task_map).has(task.plugin.pluginId)) return

  store.set(
    j_install_task_map,
    produce((tasks) => {
      tasks.set(task.plugin.pluginId, task)
    })
  )
}
export function removeTask(pluginId: string) {
  const store = getDefaultStore()

  if (!store.get(j_install_task_map).has(pluginId)) return

  store.set(
    j_install_task_map,
    produce((tasks) => {
      tasks.delete(pluginId)
    })
  )
}

/**
 * TODO: better design
 * InstallTask in not reactive, so we need to manage state `j_install_stats_map`
 * with task's event listeners, it's not so elegant now
 */
export function watchInstallState(task: InstallTask) {
  // set an empty state to represent download will start
  // for `downloading` in `AvaPluginItem.tsx`
  getDefaultStore().set(
    j_install_stats_map,
    produce((draft) => {
      draft.set(task.plugin.pluginId, {
        state: task.state,
        size: 0,
        totalSize: 0,
      })
      return draft
    })
  )

  const onProgress = (progress: InstallTaskEventMap['download:progress']) => {
    getDefaultStore().set(
      j_install_stats_map,
      produce((draft) => {
        draft.set(task.plugin.pluginId, {
          state: task.state,
          size: progress.totalBytesWritten,
          totalSize: progress.totalBytesExpectedToWrite,
        })
        return draft
      })
    )
  }
  task.on('download:progress', onProgress)

  const onStateChange = (newState: InstallTaskEventMap['state:change']) => {
    getDefaultStore().set(
      j_install_stats_map,
      produce((draft) => {
        const preStats = draft.get(task.plugin.pluginId)
        draft.set(task.plugin.pluginId, {
          state: newState,
          size: preStats?.size ?? 0,
          totalSize: preStats?.totalSize ?? 0,
        })
        return draft
      })
    )
  }
  task.on('state:change', onStateChange)

  const cleanAll = (state: InstallTask['state']) => {
    if (state === InstallTaskState.FINISHED) {
      task.off('download:progress', onProgress)
      task.off('state:change', onStateChange)
      task.off('state:change', cleanAll)

      getDefaultStore().set(
        j_install_stats_map,
        produce((draft) => {
          draft.delete(task.plugin.pluginId)
          return draft
        })
      )
    }
  }
  task.on('state:change', cleanAll)
}

export function downloadPercentageText(
  size: number,
  targetSize: number
): string {
  if (targetSize === 0 || size === 0) return '0.0%'
  return `${((size / targetSize) * 100).toFixed(1)}%`
}
