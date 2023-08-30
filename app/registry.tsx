import AvaPluginItem from "@/components/registry/AvaPluginItem";
import { j_ava_plugins } from "@/store/plugin";
import { StyleSheet, View } from "react-native";
import { useAtomValue } from "jotai";
import { useNavigation } from "expo-router";
import ProgressPageIcon from "@/components/common/ProgressPageIcon";
import React, { useEffect } from "react";

const MemoAvaPluginItem = React.memo(AvaPluginItem);

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

  // @TODO useRequest
  const plugins = useAtomValue(j_ava_plugins);

  return (
    <View>
      {plugins.map((plugin) => (
        <MemoAvaPluginItem key={"avaPlugin@" + plugin.pluginId} {...plugin} />
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
