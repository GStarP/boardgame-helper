import { StyleSheet, View } from "react-native";
import { useState } from "react";
import PluginItem from "@/components/PluginItem";

export default function HomeScreen() {
  const [plugins, _] = useState([
    {
      id: "chwazi",
      name: "Chwazi",
    },
  ]);

  return (
    <View style={styles.pluginList}>
      {plugins.map((plugin) => (
        <PluginItem
          key={plugin.id}
          id={plugin.id}
          name={plugin.name}
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
