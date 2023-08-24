import * as FileSystem from "expo-file-system";
import { logger } from "@/modules/logger"
import { deletePlugin } from "./database"
import { InstallTask } from "./download"
import { getPluginDir } from ".";
import { useUpdatePlugins } from "@/store/index/index";
import { useInstallTasks } from "@/store/progress";
import { PluginInfo } from "@/store/index/types";

export function useInstallPlugin(): (plugin: PluginInfo) => InstallTask {
  const updatePlugins = useUpdatePlugins()
  const [_, addTask, removeTask] = useInstallTasks()
  const installPlugin = (plugin: PluginInfo) => {
    const task = new InstallTask(plugin)
    addTask(task)
    task.on('success', () => {
      removeTask(task.plugin.pluginId)
      updatePlugins()
    })
    task.on('cancel', () => {
      removeTask(task.plugin.pluginId)
    })
    // @TODO dev
    // task.run()
    return task
  }
  return installPlugin
}

export function useUninstallPlugin(): (pluginId: string) => Promise<void> {
  const updatePlugins = useUpdatePlugins()
  const uninstallPlugin = async (pluginId: string) => {
    logger.debug(`uninstallPlugin: ${pluginId}`)
    const p1 = deletePlugin(pluginId)
    const p2 = FileSystem.deleteAsync(getPluginDir(pluginId))
    await Promise.all([p1, p2])
    await updatePlugins()
  }
  return uninstallPlugin
}