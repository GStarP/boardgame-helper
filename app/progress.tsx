import InstallTaskItem from "@/components/progress/InstallTaskItem";
import { j_tasks } from "@/store/progress";
import { useAtomValue } from "jotai";
import React from "react";
import { View } from "react-native";

const MemoInstallTaskItem = React.memo(InstallTaskItem);

export default function ProgressScreen() {
  const pluginIds = useAtomValue(j_tasks);
  return (
    <View>
      {pluginIds.map((pluginId) => (
        <MemoInstallTaskItem key={"task@" + pluginId} pluginId={pluginId} />
      ))}
    </View>
  );
}
