import { InstallTaskState } from '@/modules/plugin/types'

export interface InstallTaskProgress {
  pluginId: string
  state: InstallTaskState
  size: number
  targetSize: number
}
