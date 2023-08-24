import { useEffect } from 'react';
import { useState } from 'react';
import { InstallTask } from "@/modules/plugin/download";
import { InstallTaskState } from '@/modules/plugin/types';
import { DownloadProgressData } from 'expo-file-system';

export function useInstallTaskState(task: InstallTask): [InstallTaskState, number, number] {
  const [state, setState] = useState(InstallTaskState.WAITING)
  const [size, setSize] = useState(0)
  const [totalSize, setTotalSize] = useState(0)

  useEffect(() => {
    const onStateChange = (state: InstallTaskState) => {
      setState(state)
    }
    task.on('state:change', onStateChange)

    const onProgress = (progress: DownloadProgressData) => {
      setSize(progress.totalBytesWritten)
      setTotalSize(progress.totalBytesExpectedToWrite)
    }
    task.on('download:progress', onProgress)

    return () => {
      task.removeListener('state:change', onStateChange)
      task.removeListener('download:progress', onProgress)
    }
  }, [])

  return [state, size, totalSize]
}