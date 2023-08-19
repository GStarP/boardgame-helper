import { StyleSheet, View } from "react-native";
import PluginItem from "@/components/PluginItem";
import { useAtom } from "jotai";
import { j_plugins } from "@/store/index/index";
import { useEffect } from "react";
import { readPlugins } from "@/modules/plugin";
import { logger } from "@/modules/logger";

export default function HomeScreen() {
  // plugins
  const [plugins, setPlugins] = useAtom(j_plugins);
  useEffect(() => {
    try {
      readPlugins().then((newPlugins) => {
        setPlugins(newPlugins);
      });
    } catch (e) {
      logger.error(`readPlugins: err=${e}`);
    }
  }, []);

  return (
    <View style={styles.pluginList}>
      {plugins.map((plugin) => (
        <PluginItem
          key={"plugin" + plugin.pluginId}
          id={plugin.pluginId}
          name={plugin.pluginName}
          icon={plugin.pluginIcon}
        ></PluginItem>
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
