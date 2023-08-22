import { StyleSheet, View } from "react-native";
import PluginItem from "@/components/index/PluginItem";
import { usePlugins } from "@/store/index/index";
import { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

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
  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toRegistryPage}>
          <MaterialIcons name="add-to-drive" size={28} />
        </TouchableOpacity>
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
});
