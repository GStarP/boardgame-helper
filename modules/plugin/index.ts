import * as FileSystem from "expo-file-system";
import { logger } from "@/modules/logger";
import { InstallTask } from "./task";
import { setupInstallTaskProgress } from "@/modules/progress";
import { PluginInfo } from "@/store/plugin/types";
import { getPluginDir } from "./util";
import { deletePlugin, getAllPlugins } from "@/api/plugin/db";
import { setPlugins } from "@/store/plugin";

export async function updatePlugins() {
  const plugins = await getAllPlugins();
  setPlugins(plugins);
}

export async function installPlugin(plugin: PluginInfo) {
  const task = new InstallTask(plugin);
  const removeTask = setupInstallTaskProgress(task);

  task.on("success", () => {
    removeTask();
    updatePlugins();
  });
  task.on("cancel", () => {
    removeTask();
  });
  
  task.run()
  return task;
}

export async function uninstallPlugin(pluginId: string): Promise<void> {
  logger.debug(`uninstallPlugin: ${pluginId}`);
  const p1 = deletePlugin(pluginId);
  const p2 = FileSystem.deleteAsync(getPluginDir(pluginId));
  await Promise.all([p1, p2]);
  await updatePlugins();
}
