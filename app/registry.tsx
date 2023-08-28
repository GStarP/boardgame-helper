import AvaPluginItem from "@/components/registry/AvaPluginItem";
import { j_ava_plugins } from "@/store/registry";
import { StyleSheet, Text, View } from "react-native";
import { useAtomValue } from "jotai";

export default function Registry() {
  const plugins = useAtomValue(j_ava_plugins);

  return (
    <View>
      {plugins.map((plugin) => (
        <AvaPluginItem key={"avaPlugin@" + plugin.pluginId} {...plugin} />
      ))}
    </View>
  );
}
