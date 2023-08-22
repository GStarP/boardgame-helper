import AvaPluginItem from "@/components/registry/AvaPluginItem";
import { useAvailablePlugins } from "@/store/registry";
import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";

export default function Registry() {
  const [plugins, loading, updatePlugins] = useAvailablePlugins();
  useEffect(() => {
    updatePlugins();
  }, []);

  return (
    <View>
      {plugins.map((plugin) => (
        <AvaPluginItem key={"avaPlugin@" + plugin.pluginId} {...plugin} />
      ))}
    </View>
  );
}
