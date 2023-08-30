import {
  addTask,
  j_task_progress_family,
  removeTask,
  setTaskProgress,
  taskMap,
} from "@/store/progress";
import { InstallTask } from "@/modules/plugin/task";
import { logger } from "@/modules/logger";
import { EMPTY_FUNC } from "@/modules/common/const";
import { InstallTaskState } from "@/modules/plugin/types";
import { DownloadProgressData } from "expo-file-system";

/**
 * @returns func cleanTask
 */
export function setupInstallTaskProgress(task: InstallTask): () => void {
  const pluginId = task.plugin.pluginId;
  if (taskMap.has(pluginId)) {
    logger.warn("task already in progress");
    return EMPTY_FUNC;
  }

  // @FIX tell AvaPluginItem to hide download button
  // dont need to wait until first progress
  setTaskProgress(pluginId, {
    targetSize: 1,
  });

  const onStateChange = (state: InstallTaskState) => {
    setTaskProgress(pluginId, {
      state,
    });
  };
  task.on("state:change", onStateChange);

  const onProgress = (progress: DownloadProgressData) => {
    setTaskProgress(pluginId, {
      size: progress.totalBytesWritten,
      targetSize: progress.totalBytesExpectedToWrite,
    });
  };
  task.on("download:progress", onProgress);
  // store task
  addTask(task);

  const cleanTask = () => {
    task.removeListener("state:change", onStateChange);
    task.removeListener("download:progress", onProgress);

    setTaskProgress(pluginId, {
      state: InstallTaskState.WAITING,
      size: 0,
      targetSize: 0,
    });
    removeTask(pluginId);
  };

  return cleanTask;
}

export function downloadPercentageText(
  size: number,
  targetSize: number
): string {
  if (targetSize === 0 || size === 0) return "0.0%";
  return `${((size / targetSize) * 100).toFixed(1)}%`;
}
