import { useInstallPlugin } from "@/modules/plugin/hooks";
import type { PluginDetail } from "@/store/registry/types";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { imgBlurHash } from "@/modules/common/const";
import { COLOR_FONT_SECONDARY } from "@/modules/common/style";

export default function AvaPluginItem(props: PluginDetail) {
  const { pluginId, pluginName, pluginIcon, pluginDesc } = props;
  const installPlugin = useInstallPlugin();

  const install = () => {
    installPlugin(pluginId);
  };
  return (
    <View style={styles.container}>
      <Image
        source={pluginIcon}
        style={styles.icon}
        placeholder={imgBlurHash}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{pluginName}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {pluginDesc}
        </Text>
      </View>
      <Pressable style={styles.installBtn} onPress={install}>
        <MaterialIcons name="file-download" size={32} />
      </Pressable>
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
  info: { display: "flex", marginLeft: 8, flex: 1 },
  name: {
    fontSize: 16,
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
  installBtn: {},
  hr: {
    position: "absolute",
    bottom: 0,
    left: 20,
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
