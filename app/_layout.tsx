import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SheetProvider } from 'react-native-actions-sheet'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { initBottomSheet } from '@/components/BottomSheet'
import { createPluginTableIfNotExist } from '@/data/database/plugin'
import '@/i18n'
import { useLng } from '@/i18n'
import { i18nKeys } from '@/i18n/keys'
import '@/libs/immer'
import '@/libs/native-wind'
import {
  initBuiltinPlugins,
  installPlugin,
  updatePlugins,
} from '@/modules/common/plugin/biz'
import { recoverSavedTask } from '@/modules/common/plugin/install-task.savable'

// auto use error boundary
export { ErrorBoundary } from 'expo-router'

// * sync init tasks
SplashScreen.preventAutoHideAsync()
initBottomSheet()

// * These tasks don't block splash
initBuiltinPlugins()

export default function RootLayout() {
  // * useEffect init tasks
  // recover saved task
  useEffect(() => {
    recoverSavedTask().then((tasks) => {
      tasks.forEach((savable) => installPlugin(savable.p, savable.o))
    })
  }, [])

  // * These tasks block splash
  // init fonts
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })
  useEffect(() => {
    if (error) throw error
  }, [error])

  // init lng
  const [lngLoaded] = useLng()

  // init db
  const [dbLoaded, setDBLoaded] = useState(false)
  useEffect(() => {
    createPluginTableIfNotExist()
      .then(() => updatePlugins())
      .then(() => setDBLoaded(true))
  }, [])

  useEffect(() => {
    if (loaded && lngLoaded && dbLoaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded, lngLoaded, dbLoaded])

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <SheetProvider>
        <PaperProvider>
          <RootLayoutView />
        </PaperProvider>
      </SheetProvider>
    </SafeAreaProvider>
  )
}

function RootLayoutView() {
  const { t } = useTranslation()
  return (
    <Stack
      screenOptions={{
        animation: 'fade',
        animationDuration: 200,
        headerShown: false,
      }}
    >
      <Stack.Screen name="webview" options={{ headerShown: true }} />
      <Stack.Screen
        name="download"
        options={{
          title: t(i18nKeys.TITLE_PROGRESS),
          headerShown: true,
        }}
      />
    </Stack>
  )
}
