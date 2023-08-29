import { ToastAndroid } from "react-native";
import * as FileSystem from "expo-file-system";
import { logger } from "@/modules/logger";
import { InstallTask } from "./task";
import { setupInstallTaskProgress } from "@/modules/progress";
import { PluginInfo } from "@/store/plugin/types";
import { getPluginDir } from "./util";
import { deletePlugin, getAllPlugins } from "@/api/plugin/db";
import { setPlugins } from "@/store/plugin";
import { TOAST_INSTALL_SUCCESS } from "@/i18n";

export async function updatePlugins() {
  const plugins = await getAllPlugins();
  setPlugins(plugins);
}

export function installPlugin(plugin: PluginInfo) {
  const task = new InstallTask(plugin);
  const cleanTask = setupInstallTaskProgress(task);

  task.on("success", async () => {
    cleanTask();
    await updatePlugins();
    ToastAndroid.show(
      `${plugin.pluginName} ${TOAST_INSTALL_SUCCESS}`,
      ToastAndroid.SHORT
    );
  });
  task.on("cancel", () => {
    cleanTask();
  });

  task.run();
  return task;
}

export async function uninstallPlugin(pluginId: string): Promise<void> {
  logger.debug(`uninstallPlugin: ${pluginId}`);
  const p1 = deletePlugin(pluginId);
  const p2 = FileSystem.deleteAsync(getPluginDir(pluginId));
  await Promise.all([p1, p2]);
  await updatePlugins();
}
