import { StyleSheet, View, Text } from "react-native";
import PluginItem from "@/components/home/PluginItem";
import { j_plugins, setAvaPlugins, setPlugins } from "@/store/plugin/index";
import { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { getAllPlugins } from "@/api/plugin/db";
import { fetchAvailablePlugins } from "@/api/plugin";
import ProgressPageIcon from "@/components/common/ProgressPageIcon";
import { ATOM_STYLE, COLOR_FONT_THIRD } from "@/modules/common/style";
import { TEXT_NO_PLUGIN_1, TEXT_NO_PLUGIN_2 } from "@/i18n";
import { recoverSavedTask } from "@/modules/plugin/task/savable";
import { installPlugin } from "@/modules/plugin";

export default function HomeScreen() {
  // plugins
  const plugins = useAtomValue(j_plugins);
  useEffect(() => {
    getAllPlugins().then((plugins) => setPlugins(plugins));
  }, []);

  // header button
  const nav = useNavigation();
  const router = useRouter();
  const toRegistryPage = () => {
    fetchAvailablePlugins().then((plugins) => setAvaPlugins(plugins));
    router.push({
      pathname: "/registry",
    });
  };
  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={toRegistryPage}>
            <MaterialCommunityIcons name="toolbox" size={28} />
          </TouchableOpacity>
          <ProgressPageIcon style={styles.progressBtn} />
        </View>
      ),
    });
  }, [nav]);

  // recover saved task
  useEffect(() => {
    recoverSavedTask().then((tasks) =>
      tasks.forEach((savable) => installPlugin(savable.p, savable.o))
    );
  }, []);

  return (
    <View style={styles.pluginList}>
      {plugins.length > 0 ? (
        plugins.map((plugin) => (
          <PluginItem
            key={"plugin@" + plugin.pluginId}
            {...plugin}
          ></PluginItem>
        ))
      ) : (
        <View
          style={[ATOM_STYLE.wFull, ATOM_STYLE.flex, ATOM_STYLE.itemsCenter]}
        >
          <Text style={styles.none}>{TEXT_NO_PLUGIN_1}</Text>
          <Text style={styles.none}>{TEXT_NO_PLUGIN_2}</Text>
        </View>
      )}
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
  none: {
    fontSize: 16,
    color: COLOR_FONT_THIRD,
  },
});
