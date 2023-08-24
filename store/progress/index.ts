import { atom, useAtom } from "jotai";
import { InstallTask } from "@/modules/plugin/download";

export const j_tasks = atom<InstallTask[]>([])

export function useInstallTasks(): [InstallTask[], (task: InstallTask) => void, (pluginId: string) => void] {
  const [tasks, setTasks] = useAtom(j_tasks)
  const addTask = (task: InstallTask) => {
    // if task already exists, just return
    if (tasks.find(t => t.plugin.pluginId === task.plugin.pluginId)) {
      return
    }
    const newTasks = [...tasks]
    newTasks.push(task)
    setTasks(newTasks)
  }
  const removeTask = (pluginId: string) => {
    const newTasks = []
    for (const task of tasks) {
      if (task.plugin.pluginId !== pluginId) {
        newTasks.push(task)
      }
    }
    setTasks(newTasks)
  }
  return [tasks, addTask, removeTask]
}
