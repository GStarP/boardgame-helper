import InstallTaskItem from "@/components/progress/InstallTaskItem";
import { j_tasks } from "@/store/progress";
import { useAtomValue } from "jotai";
import { View } from "react-native";

export default function ProgressScreen() {
  const pluginIds = useAtomValue(j_tasks);
  return (
    <View>
      {pluginIds.map((pluginId) => (
        <InstallTaskItem key={"task@" + pluginId} pluginId={pluginId} />
      ))}
    </View>
  );
}
