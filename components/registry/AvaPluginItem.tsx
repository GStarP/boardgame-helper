import { useInstallPlugin } from "@/modules/plugin/hooks";
import type { PluginDetail } from "@/store/registry/types";
import { StyleSheet, Text, View, Button } from "react-native";

export default function AvaPluginItem(props: PluginDetail) {
  const { pluginId, pluginName, pluginIcon, pluginDesc } = props;
  const installPlugin = useInstallPlugin();

  const install = () => {
    installPlugin(pluginId);
  };

  return (
    <View>
      <Text>{pluginName}</Text>
      <Button title="下载" onPress={install} />
    </View>
  );
}
