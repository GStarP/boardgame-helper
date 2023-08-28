import { StyleSheet, View } from "react-native";
import PluginItem from "@/components/index/PluginItem";
import { j_plugins, updatePlugins } from "@/store/index/index";
import { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { updateAvailablePlugins } from "@/store/registry";
import { useAtomValue } from "jotai";

export default function HomeScreen() {
  // plugins
  const plugins = useAtomValue(j_plugins);
  useEffect(() => {
    updatePlugins();
  }, []);

  // header button
  const nav = useNavigation();
  const router = useRouter();
  const toRegistryPage = () => {
    updateAvailablePlugins();
    router.push({
      pathname: "/registry",
    });
  };
  const toProgressPage = () => {
    router.push({
      pathname: "/progress",
    });
  };
  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={toRegistryPage}>
            <MaterialCommunityIcons name="toolbox" size={28} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toProgressPage} style={styles.progressBtn}>
            <MaterialCommunityIcons name="progress-download" size={28} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [nav]);

  return (
    <View style={styles.pluginList}>
      {plugins.map((plugin) => (
        <PluginItem key={"plugin@" + plugin.pluginId} {...plugin}></PluginItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pluginList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: "6%",
    paddingVertical: "8%",
  },
  buttons: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  progressBtn: {
    marginRight: 12,
  },
});
