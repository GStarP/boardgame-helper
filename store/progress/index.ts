import { atom, useAtom } from "jotai";
import { InstallTask } from "@/modules/plugin/download";

export const j_tasks = atom<InstallTask[]>([])

export function useInstallTasks(): [InstallTask[], (task: InstallTask) => void, (pluginId: string) => void] {
  const [tasks, setTasks] = useAtom(j_tasks)
  const addTask = (task: InstallTask) => {
    const newTasks = [...tasks]
    newTasks.push(task)
    setTasks(newTasks)
  }
  const removeTask = (pluginId: string) => {
    const newTasks = []
    for (const task of tasks) {
      if (task.pluginId !== pluginId) {
        newTasks.push(task)
      }
    }
    setTasks(newTasks)
  }
  return [tasks, addTask, removeTask]
}
