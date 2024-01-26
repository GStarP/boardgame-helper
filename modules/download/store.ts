import { atom } from 'jotai'

import type { InstallTask } from '@/modules/plugin/task'

import { InstallTaskState } from '../plugin/types'

export const j_install_task_map = atom<Map<string, InstallTask>>(new Map())

export type InstallStats = {
  state: InstallTaskState
  size: number
  totalSize: number
}
export const j_install_stats_map = atom<Map<string, InstallStats>>(new Map())
