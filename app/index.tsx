import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { mockUnzip } from "@/modules/plugin/mock";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    mockUnzip();
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        onPress={() => {
          router.push("/plugin");
        }}
      >
        Chwazi
      </Text>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
