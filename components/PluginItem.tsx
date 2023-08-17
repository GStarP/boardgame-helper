import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface PluginItemProps {
  id: string;
  name: string;
  icon: string;
}

export default function PluginItem(props: PluginItemProps) {
  const router = useRouter();

  const { id, name, icon } = props;

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
        <Image source={icon} style={styles.pluginIcon}></Image>
        <Text style={styles.pluginName}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // 2.5*2*4 + 20*4 = 100
  pluginItem: {
    width: "20%",
    marginHorizontal: "2.5%",
  },
  pluginIcon: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    aspectRatio: 1,
  },
  pluginName: {
    width: "100%",
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
  },
});
