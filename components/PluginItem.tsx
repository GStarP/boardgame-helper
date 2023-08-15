import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text, StyleSheet } from "react-native";

interface PluginItemProps {
  id: string;
  name: string;
}

export default function PluginItem(props: PluginItemProps) {
  const router = useRouter();

  const { id, name } = props;

  const toPluginPage = () => {
    router.push({
      pathname: "/plugin",
      params: {
        id,
      },
    });
  };
  return (
    // TODO change to Pressable
    <View style={styles.pluginItem}>
      <TouchableOpacity onPress={toPluginPage}>
        <View style={styles.pluginIcon}></View>
        <Text style={styles.pluginName}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // 2*2*4 + 21*4 = 100
  pluginItem: {
    width: "21%",
    marginHorizontal: "2%",
  },
  pluginIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",

    borderRadius: 4,
    width: "100%",
    aspectRatio: 1,
  },
  pluginName: {
    width: "100%",
    textAlign: "center",
    marginVertical: 4,
    fontSize: 16,
  },
});
