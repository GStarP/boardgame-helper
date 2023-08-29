import AvaPluginItem from "@/components/registry/AvaPluginItem";
import { j_ava_plugins } from "@/store/plugin";
import { StyleSheet, View } from "react-native";
import { useAtomValue } from "jotai";
import { useNavigation } from "expo-router";
import ProgressPageIcon from "@/components/common/ProgressPageIcon";
import { useEffect } from "react";

export default function Registry() {
  // header button
  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <View style={styles.buttons}>
          <ProgressPageIcon />
        </View>
      ),
    });
  }, [nav]);

  const plugins = useAtomValue(j_ava_plugins);

  return (
    <View>
      {plugins.map((plugin) => (
        <AvaPluginItem key={"avaPlugin@" + plugin.pluginId} {...plugin} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
});
