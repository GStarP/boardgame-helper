import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { imgBlurHash } from "@/modules/common/const";
import {
  COLOR_FONT_FOURTH,
  COLOR_FONT_SECONDARY,
} from "@/modules/common/style";
import { TouchableOpacity } from "react-native-gesture-handler";
import React from "react";
import { InstallTask } from "@/modules/plugin/download";
import { useInstallTaskState } from "@/modules/progress/hook";
import { InstallTaskState } from "@/modules/progress/types";

interface Props {
  task: InstallTask;
}

function stateText(
  state: InstallTaskState,
  size: number,
  totalSize: number
): string {
  if (state === InstallTaskState.PAUSED) return "已暂停";
  else if (state === InstallTaskState.UNZIPPING) return "解压中";
  else if (state === InstallTaskState.DOWNLOADING)
    return `${size} / ${totalSize}`;
  else if (state === InstallTaskState.WAITING) return "等待中";
  return "";
}

function stateBtnIcon(state: InstallTaskState) {
  if (state === InstallTaskState.PAUSED || state === InstallTaskState.WAITING)
    return "play-circle-outline";
  else if (state === InstallTaskState.DOWNLOADING)
    return "pause-circle-outline";
  return "blank";
}

function InstallTaskItem(props: Props) {
  const { task } = props;

  const [state, size, totalSize] = useInstallTaskState(task);

  const togglePause = () => {
    if (state === InstallTaskState.WAITING) {
      task.run();
    }
  };

  return (
    <View style={styles.container}>
      <Image source={""} style={styles.icon} placeholder={imgBlurHash} />
      <View style={styles.info}>
        <Text style={styles.name}>{"Chwazi"}</Text>
        <Text style={styles.state}>{stateText(state, size, totalSize)}</Text>
        <View style={styles.progressContainer}></View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={togglePause}>
        <MaterialCommunityIcons name={stateBtnIcon(state)} size={32} />
      </TouchableOpacity>
      <View style={styles.hr}></View>
    </View>
  );
}

export default React.memo(InstallTaskItem);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 96,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  icon: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 4,
  },
  info: { display: "flex", marginLeft: 8, flex: 1, height: "100%" },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  state: { color: COLOR_FONT_SECONDARY, fontSize: 12, marginBottom: 4 },
  progressContainer: {
    width: "100%",
    height: 4,
    borderRadius: 4,
    backgroundColor: COLOR_FONT_FOURTH,
  },
  btn: {
    marginLeft: 8,
  },
  hr: {
    position: "absolute",
    bottom: 0,
    left: 20,
    height: 0.5,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
