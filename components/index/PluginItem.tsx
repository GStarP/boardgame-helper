import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import type { PluginInfo } from "@/store/index/types";
import { useUninstallPlugin } from "@/modules/plugin/hooks";

export default function PluginItem(props: PluginInfo) {
  const router = useRouter();

  const { pluginId, pluginName, pluginIcon } = props;

  const toPluginPage = () => {
    router.push({
      pathname: "/plugin",
      params: {
        id: pluginId,
        name: pluginName,
      },
    });
  };

  const uninstallPlugin = useUninstallPlugin();
  const uninstall = () => {
    // uninstallPlugin(pluginId);
  };

  return (
    // TODO change to Pressable
    <View style={styles.pluginItem}>
      <TouchableOpacity onPress={toPluginPage} onLongPress={uninstall}>
        <Image source={pluginIcon} style={styles.pluginIcon}></Image>
        <Text style={styles.pluginName}>{pluginName}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // 2.5*2*4 + 20*4 = 100
  pluginItem: {
    width: "20%",
    marginHorizontal: "2.5%",
  },
  pluginIcon: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    aspectRatio: 1,
  },
  pluginName: {
    width: "100%",
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
  },
});
