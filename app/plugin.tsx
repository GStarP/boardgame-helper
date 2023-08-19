import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { getPluginEntry } from "@/modules/plugin";
import WebView from "react-native-webview";
import {
  WebViewMessageEvent,
  WebViewProgressEvent,
} from "react-native-webview/lib/WebViewTypes";
import { logger } from "@/modules/logger";
import { WebViewErrorEvent } from "react-native-webview/lib/RNCWebViewNativeComponent";

export default function PluginScreen() {
  const id = useLocalSearchParams().id as string;

  // must set uri in `onMounted`, otherwise will get `ERR_ACCESS_DENIED`
  // https://github.com/react-native-webview/react-native-webview/issues/656#issuecomment-551312436
  const [uri, setUri] = useState("");
  useEffect(() => {
    const pluginEntry = getPluginEntry(id);
    setUri(pluginEntry);
    logger.info(`setUri: ${pluginEntry}`);
  }, [id]);

  /**
   * progress
   */
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const pluginLoadStart = () => {
    logger.debug("plugin load: start ===>");
  };
  const pluginLoadProgress = (e: WebViewProgressEvent) => {
    const progress = e.nativeEvent.progress;
    logger.debug(`plugin load: progress=${progress}`);
    setProgress(progress);
  };
  const pluginLoadEnd = () => {
    logger.debug("plugin load: end <=====");
    pluginLoaded();
  };
  // make sure `100%` show for at least 1s
  const pluginLoaded = () => {
    setTimeout(() => setReady(true), 1000);
  };

  /**
   * log trace
   */
  const onError = (e: WebViewErrorEvent): void => {
    logger.error(
      `[Webview Error] url=${e.url} code=${e.code} loading=${e.loading} title=${e.title} lockId=${e.lockIdentifier}`
    );
  };
  // proxy Webview's console
  const preloadJS = `const J_LOG=(level,msg)=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'Console',data:{level,msg}}));
    console={log:(log)=>J_LOG('log', log),debug:(log) =>J_LOG('debug', log),info:(log) =>J_LOG('info', log),warn:(log) =>J_LOG('warn', log),error:(log) =>J_LOG('error', log),};`;
  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const dataPayload = JSON.parse(event.nativeEvent.data);
      if (dataPayload?.type === "Console") {
        const {
          level,
          msg,
        }: {
          level: "debug" | "log" | "warn" | "error";
          msg: string;
        } = dataPayload.data;
        logger[level](`[Webview] ${msg}`);
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
        // @ts-ignore @FIX weird type error
        onError={onError}
        onLoadStart={pluginLoadStart}
        onLoad={pluginLoadEnd}
        onLoadProgress={pluginLoadProgress}
        injectedJavaScript={preloadJS}
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
