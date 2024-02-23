import produce from 'immer'
import { getDefaultStore } from 'jotai'

import { InstallTask } from '@/modules/common/plugin/install-task'
import { InstallTaskEventMap } from '@/modules/common/plugin/install-task.type'

import { DownloadStore } from './store'

/**
 * InstallTask is not reactive, so we need to manage state
 * in `DownloadStore.installTaskStatusMap` with task's event listeners
 */
export function watchInstallState(task: InstallTask) {
  // set an empty state to represent download will start
  // for `downloading` in `RegistryPluginItem.tsx`
  getDefaultStore().set(
    DownloadStore.installTaskStatusMap,
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
      DownloadStore.installTaskStatusMap,
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
      DownloadStore.installTaskStatusMap,
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

  task.once(['success', 'cancel'], () => {
    task.off('download:progress', onProgress)
    task.off('state:change', onStateChange)
    getDefaultStore().set(
      DownloadStore.installTaskStatusMap,
      produce((draft) => {
        draft.delete(task.plugin.pluginId)
        return draft
      })
    )
  })
}

export function downloadPercentageText(
  size: number,
  targetSize: number
): string {
  if (targetSize === 0 || size === 0) return '0.0%'
  return `${((size / targetSize) * 100).toFixed(1)}%`
}
