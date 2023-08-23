import * as FileSystem from "expo-file-system";
import { logger } from "@/modules/logger"
import { deletePlugin } from "./database"
import { InstallPluginTask } from "./download"
import { getPluginDir } from ".";
import { useUpdatePlugins } from "@/store/index/index";

export function useInstallPlugin(): (pluginId: string) => InstallPluginTask {
  const updatePlugins = useUpdatePlugins()
  const installPlugin = (pluginId: string) => {
    const task = new InstallPluginTask(pluginId)
    task.on('success', updatePlugins)
    task.run()
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