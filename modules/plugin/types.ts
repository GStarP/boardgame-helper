import type { DownloadPauseState, DownloadProgressData, FileSystemDownloadResult } from 'expo-file-system'

export type LoadPluginTaskEventMap = {
  'download:start': DownloadPauseState
  'download:finish': FileSystemDownloadResult
  'download:progress': DownloadProgressData
  'download:pause': DownloadPauseState
  'unzip:start': undefined
  'unzip:finish': undefined
  'success': undefined
  'error': Error | unknown
}