import { StyleSheet, Text, View } from "react-native";
import { testMockUnzip } from "@/modules/plugin/mock";
import { useEffect } from "react";

export default function PluginScreen() {
  useEffect(() => {
    testMockUnzip();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plugin</Text>
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
