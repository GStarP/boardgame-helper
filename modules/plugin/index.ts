import { ToastAndroid } from "react-native";
import * as FileSystem from "expo-file-system";
import type { DownloadPauseState } from "expo-file-system";
import { logger } from "@/modules/logger";
import { InstallTask } from "./task";
import { TaskProgressDecorator } from "@/modules/plugin/task/progress";
import type { PluginInfo } from "@/store/plugin/types";
import { getPluginDir } from "./util";
import { deletePlugin, getAllPlugins } from "@/api/plugin/db";
import { setPlugins } from "@/store/plugin";
import { TOAST_INSTALL_SUCCESS } from "@/i18n";
import { TaskSavableDecorator } from "./task/savable";
import { taskMap } from "@/store/progress";

export async function updatePlugins() {
  const plugins = await getAllPlugins();
  setPlugins(plugins);
}

export function installPlugin(
  plugin: PluginInfo,
  savable?: DownloadPauseState
) {
  // if task already exists, return
  if (taskMap.has(plugin.pluginId)) {
    return;
  }
  let task = new InstallTask(plugin, savable);
  // @TODO use dynamic settings to control
  task = TaskSavableDecorator(task);

  const cleanTask = TaskProgressDecorator(task);

  task.on("success", async () => {
    await updatePlugins();
    ToastAndroid.show(
      `${plugin.pluginName} ${TOAST_INSTALL_SUCCESS}`,
      ToastAndroid.SHORT
    );
  });
  // stop collecting progress
  task.on(["success", "cancel"], () => {
    cleanTask();
  });
  // @DEV
  // task.run();
  return task;
}

export async function uninstallPlugin(pluginId: string): Promise<void> {
  logger.debug(`uninstallPlugin: ${pluginId}`);
  const p1 = deletePlugin(pluginId);
  const p2 = FileSystem.deleteAsync(getPluginDir(pluginId));
  await Promise.all([p1, p2]);
  await updatePlugins();
}
