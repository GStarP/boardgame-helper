import { DownloadPauseState, DownloadProgressData, FileSystemDownloadResult } from 'expo-file-system'

export type LoadPluginTaskEventMap = {
  'downalod:start': DownloadPauseState
  'download:finish': FileSystemDownloadResult
  'download:progress': DownloadProgressData
  'download:pause': DownloadPauseState
  'unzip:start': undefined
  'unzip:finish': undefined
  'error': Error
}