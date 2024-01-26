import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SheetProvider } from 'react-native-actions-sheet'

import {
  createPluginTableIfNotExist,
  getAllPlugins,
} from '@/data/database/plugin'
import '@/i18n'
import { useLng } from '@/i18n'
import { i18nKeys } from '@/i18n/keys'
import { initBuiltinPlugins } from '@/modules/plugin'
import '@/plugins/immer'
import { setPlugins } from '@/store/plugin'

// auto use error boundary
export { ErrorBoundary } from 'expo-router'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

// * These tasks don't block splash
initBuiltinPlugins()

export default function RootLayout() {
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
      .then(() => getAllPlugins())
      .then((plugins) => {
        setPlugins(plugins)
        setDBLoaded(true)
      })
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
    <SheetProvider>
      <RootLayoutView />
    </SheetProvider>
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
      <Stack.Screen name="plugin" options={{ headerShown: true }} />
      <Stack.Screen
        name="download"
        options={{
          title: t(i18nKeys.TITLE_PROGRESS),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: t(i18nKeys.TITLE_SETTINGS),
          headerShown: true,
        }}
      />
    </Stack>
  )
}
