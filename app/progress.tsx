import InstallTaskItem from "@/components/progress/InstallTaskItem";
import { useInstallTasks } from "@/store/progress";
import { View } from "react-native";

export default function ProgressScreen() {
  const [tasks] = useInstallTasks();
  return (
    <View>
      {tasks.map((task) => (
        <InstallTaskItem key={"task@" + task.plugin.pluginId} task={task} />
      ))}
    </View>
  );
}
