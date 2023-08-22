import { installPlugin } from "@/modules/plugin/download";
import { PluginDetail } from "@/store/registry/types";
import { StyleSheet, Text, View, Button } from "react-native";

export default function AvaPluginItem(props: PluginDetail) {
  const { pluginId, pluginName, pluginIcon, pluginDesc } = props;
  return (
    <View>
      <Text>{pluginName}</Text>
      <Button title="下载" onPress={() => installPlugin(pluginId)} />
    </View>
  );
}
