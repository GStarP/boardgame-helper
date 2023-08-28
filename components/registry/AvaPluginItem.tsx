import { useInstallPlugin } from "@/modules/plugin/hooks";
import type { PluginDetail } from "@/store/registry/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { IMG_BLUR_HASH } from "@/modules/common/const";
import { COLOR_FONT_SECONDARY } from "@/modules/common/style";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useInstallTasks } from "@/store/progress";

export default function AvaPluginItem(props: PluginDetail) {
  const { pluginId, pluginName, pluginIcon, pluginDesc } = props;

  const [tasks] = useInstallTasks();
  const downloading =
    tasks.find((task) => task.plugin.pluginId === pluginId) !== void 0;

  const installPlugin = useInstallPlugin();
  const install = () => {
    // if already downloading, dont't install again
    if (downloading) return;
    installPlugin(props);
  };

  return (
    <View style={styles.container}>
      <Image
        source={pluginIcon}
        style={styles.icon}
        placeholder={IMG_BLUR_HASH}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{pluginName}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {pluginDesc}
        </Text>
      </View>
      {downloading ? (
        <Text style={styles.text}>下载中</Text>
      ) : (
        <TouchableOpacity onPress={install}>
          <MaterialCommunityIcons name={"cloud-download"} size={32} />
        </TouchableOpacity>
      )}
      <View style={styles.hr}></View>
    </View>
  );
}

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
  info: { display: "flex", marginLeft: 8, flex: 1, height: "100%" },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: COLOR_FONT_SECONDARY,
  },
  icon: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 4,
  },
  text: { width: 32, fontSize: 12, textAlign: "center" },
  hr: {
    position: "absolute",
    bottom: 0,
    left: 20,
    height: 0.5,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
