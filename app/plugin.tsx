import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { Text, ToastAndroid, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import WebView from 'react-native-webview'
import { WebViewErrorEvent } from 'react-native-webview/lib/RNCWebViewNativeComponent'
import type {
  WebViewMessageEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes'

import { logger } from '@/modules/logger'
import { getPluginEntry } from '@/modules/plugin/util'
import {
  ToastDuration,
  ToastPosition,
  WebviewMessage,
  WebviewMessageType,
} from '@/modules/webview'

export default function PluginScreen() {
  const searchParams = useLocalSearchParams()

  // use plugin name as title
  const nav = useNavigation()
  const name = searchParams.name.toString()
  useEffect(() => {
    nav.setOptions({
      title: name,
    })
  }, [nav, name])

  // must set uri in `onMounted`, otherwise will get `ERR_ACCESS_DENIED`
  // https://github.com/react-native-webview/react-native-webview/issues/656#issuecomment-551312436
  const id = searchParams.id.toString()
  const [uri, setUri] = useState('')
  useEffect(() => {
    const pluginEntry = getPluginEntry(id)
    setUri(pluginEntry)
    logger.debug('PluginScreen', 'setUri', pluginEntry)
  }, [id])

  // progress value: 0 ~ 1
  const [progress, setProgress] = useState(0)
  // progress percentage: 0 ~ 100
  const a_width = useSharedValue(0)
  const a_style = useAnimatedStyle(() => ({
    width: `${a_width.value}%`,
  }))
  function updateProgress(newProgress: number) {
    setProgress(newProgress)
    a_width.value = withTiming(Math.floor(newProgress * 100))
  }

  const onLoadStart = () => {
    logger.debug('plugin load: start ===>')
  }
  const onLoadProgress = (e: WebViewProgressEvent) => {
    logger.debug(`plugin load: progress=${e.nativeEvent.progress}`)

    updateProgress(e.nativeEvent.progress)
  }
  const onLoadEnd = () => {
    logger.debug('plugin load: end <=====')
    onLoaded()
  }

  // make sure `100%` show for at least 1.2s
  const [ready, setReady] = useState(false)
  const onLoaded = () => {
    setTimeout(() => setReady(true), 1200)
  }

  const onError = (e: WebViewErrorEvent): void => {
    logger.error(
      'Webview',
      `url=${e.url} code=${e.code} loading=${e.loading} title=${e.title} lockId=${e.lockIdentifier}`
    )
  }

  // * inject webview api
  const apiJS = 'window.bgt={};'
  const logJS = `window.bgt.log=(l,m)=>window.ReactNativeWebView.postMessage(JSON.stringify({type:0,data:{l,m}}));window.console={log:(m)=>window.bgt.log('info',m),debug:(m) =>window.bgt.log('debug',m),info:(m) =>window.bgt.log('info',m),warn:(m)=>window.bgt.log('warn',m),error:(m)=>window.bgt.log('error',m)};`
  const toastJS = `window.bgt.toast=(v,d=0,p=1)=>window.ReactNativeWebView.postMessage(JSON.stringify({type:1,data:{v,d,p}}));`

  const preloadJS = apiJS + logJS + toastJS

  const onMessage = (event: WebViewMessageEvent) => {
    logger.debug('Webview', 'onMessage', event.nativeEvent.data)
    try {
      const msg: WebviewMessage = JSON.parse(event.nativeEvent.data)
      if (msg.type === WebviewMessageType.CONSOLE) {
        const { l: level, m: message } = msg.data
        logger[level]('Webview', 'Log', message)
      } else if (msg.type === WebviewMessageType.TOAST) {
        const { v: content, d: duration, p: position } = msg.data
        ToastAndroid.showWithGravity(
          content,
          duration === ToastDuration.SHORT
            ? ToastAndroid.SHORT
            : ToastAndroid.LONG,
          position === ToastPosition.TOP
            ? ToastAndroid.TOP
            : position === ToastPosition.BOTTOM
            ? ToastAndroid.BOTTOM
            : ToastAndroid.CENTER
        )
      }
    } catch (e) {
      logger.error('Webview', 'onMessage', e)
    }
  }

  return (
    <View className="flex-1">
      {
        /* loading progress */
        ready ? null : (
          <View className="absolute w-full h-full z-10 justify-center items-center bg-white">
            <Text className="text-base mb-1 mt-[-10%]">
              Loading: {(progress * 100).toFixed(2)}%
            </Text>
            <View className="bg-[#CCC] w-[60%] h-6 rounded">
              <Animated.View
                className="bg-black h-full rounded"
                style={a_style}
              />
            </View>
          </View>
        )
      }
      <WebView
        className="flex-1"
        source={{ uri }}
        originWhitelist={['*']}
        // false => cannot load <script>
        allowUniversalAccessFromFileURLs={true}
        // false => cannot load index.html
        allowFileAccess={true}
        cacheEnabled={false}
        // ban stretch animation when access scroll end
        overScrollMode="never"
        injectedJavaScript={preloadJS}
        // TODO: weird type error
        // @ts-ignore
        onError={onError}
        onLoadStart={onLoadStart}
        onLoad={onLoadEnd}
        onLoadProgress={onLoadProgress}
        onMessage={onMessage}
      />
    </View>
  )
}
