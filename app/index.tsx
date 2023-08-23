import { StyleSheet, View } from "react-native";
import PluginItem from "@/components/index/PluginItem";
import { usePlugins } from "@/store/index/index";
import { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  // plugins
  const [plugins, updatePlugins] = usePlugins();
  useEffect(() => {
    updatePlugins();
  }, []);

  // header button
  const nav = useNavigation();
  const router = useRouter();
  const toRegistryPage = () => {
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
