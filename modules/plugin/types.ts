import type { DownloadPauseState, DownloadProgressData, FileSystemDownloadResult } from 'expo-file-system'

export type LoadPluginTaskEventMap = {
  'download:progress': DownloadProgressData
  'download:start': DownloadPauseState
  'download:pause': DownloadPauseState
  'download:resume': DownloadPauseState
  'download:finish': FileSystemDownloadResult
  'unzip:start': undefined
  'unzip:finish': undefined
  'register:start': undefined
  'register:finish': undefined
  'success': undefined
  'cancel': undefined
  'error': Error | unknown
  'state:change': InstallTaskState
}

export enum InstallTaskState {
  WAITING,
  DOWNLOADING,
  PAUSED,
  UNZIPPING,
  REGISTERING,
  FINISH,
  ERROR
}