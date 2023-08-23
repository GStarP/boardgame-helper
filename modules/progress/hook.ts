import { useEffect } from 'react';
import { useState } from 'react';
import { InstallTask } from "@/modules/plugin/download";
import { InstallTaskState } from './types';
import { DownloadProgressData } from 'expo-file-system';

export function useInstallTaskState(task: InstallTask): [InstallTaskState, number, number] {
  const [state, setState] = useState(InstallTaskState.WAITING)
  const [size, setSize] = useState(0)
  const [totalSize, setTotalSize] = useState(0)

  useEffect(() => {
    const onDownloadStart = () => {
      setState(InstallTaskState.DOWNLOADING)
    }
    task.on('download:start', onDownloadStart)

    const onProgress = (progress: DownloadProgressData) => {
      setSize(progress.totalBytesWritten)
      setTotalSize(progress.totalBytesExpectedToWrite)
    }
    task.on('download:progress', onProgress)

    const onPause = () => {
      setState(InstallTaskState.PAUSED)
    }
    task.on('download:pause', onPause)

    const onUnzip = () => {
      setState(InstallTaskState.UNZIPPING)
    }
    task.on('unzip:start', onUnzip)

    const onSuccess = () => {
      setState(InstallTaskState.SUCCESS)
    }
    task.on('success', onSuccess)

    const onError = () => {
      setState(InstallTaskState.PAUSED)
    }
    task.on('error', onError)

    return () => {
      task.removeListener('download:start', onDownloadStart)
      task.removeListener('download:progress', onProgress)
      task.removeListener('download:pause', onPause)
      task.removeListener('unzip:start', onUnzip)
      task.removeListener('success', onSuccess)
      task.removeListener('error', onError)
    }
  }, [])

  return [state, size, totalSize]
}