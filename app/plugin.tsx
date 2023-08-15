import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { getPluginUri } from "@/modules/plugin";
import WebView from "react-native-webview";
import {
  WebViewMessageEvent,
  WebViewProgressEvent,
} from "react-native-webview/lib/WebViewTypes";

export default function PluginScreen() {
  const id = useLocalSearchParams().id as string;

  // must set uri in `onMounted`, otherwise will get `ERR_ACCESS_DENIED`
  // https://github.com/react-native-webview/react-native-webview/issues/656#issuecomment-551312436
  const [uri, setUri] = useState("");
  useEffect(() => {
    setUri(getPluginUri(id));
  }, [id]);

  /**
   * progress
   */
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const pluginLoadStart = () => {
    console.log("plugin load start");
  };
  const pluginLoadProgress = (e: WebViewProgressEvent) => {
    const progress = e.nativeEvent.progress;
    setProgress(progress);
  };
  const pluginLoadEnd = () => {
    console.log("plugin load end");
    pluginLoaded();
  };
  // @FIX make sure `100%` show for at least 1s
  const pluginLoaded = () => {
    setTimeout(() => setReady(true), 1000);
  };

  // view logs inside webview
  const logPreload = `const J_LOG=(level,msg)=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'Console',data:{level,msg}}));
    console={log:(log)=>J_LOG('log', log),debug:(log) =>J_LOG('debug', log),info:(log) =>J_LOG('info', log),warn:(log) =>J_LOG('warn', log),error:(log) =>J_LOG('error', log),};`;
  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const dataPayload = JSON.parse(event.nativeEvent.data);
      if (dataPayload?.type === "Console") {
        console.debug(`[Webview] ${JSON.stringify(dataPayload.data)}`);
      }
    } catch (e) {}
  };

  return (
    <View style={{ flex: 1 }}>
      {
        /* loading progress */
        ready ? null : (
          <View style={styles.loading}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  {
                    width: `${Math.ceil(progress * 100)}%`,
                  },
                ]}
              ></View>
            </View>
            <Text>Loading: {(progress * 100).toFixed(2)}%</Text>
          </View>
        )
      }
      <WebView
        style={{ flex: 1 }}
        source={{ uri }}
        originWhitelist={["*"]}
        allowFileAccess={true}
        onError={(e) => console.error("webview error:", e.nativeEvent)}
        onLoadStart={pluginLoadStart}
        onLoad={pluginLoadEnd}
        onLoadProgress={pluginLoadProgress}
        injectedJavaScript={logPreload}
        onMessage={onMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  progressBar: {
    backgroundColor: "#CCC",
    width: "60%",
    height: 24,
    borderRadius: 4,
  },
  progress: {
    backgroundColor: "#000",
    height: "100%",
    borderRadius: 4,
  },
});
