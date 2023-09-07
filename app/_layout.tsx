import { getAllPlugins } from '@/api/plugin/db'
import '@/i18n'
import { useLng } from '@/i18n'
import { i18nKeys } from '@/i18n/keys'
import { setPlugins } from '@/store/plugin'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SheetProvider } from 'react-native-actions-sheet'

// auto use error boundary
export { ErrorBoundary } from 'expo-router'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  /**
   * These async tasks should finish before splash hide
   */
  // splash screen (in-app loading animation)
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })
  // recover lng
  const [lngLoaded] = useLng()
  // read local plugins
  const [pluginsLoaded, setPluginsLoaded] = useState(false)
  useEffect(() => {
    getAllPlugins().then((res) => {
      setPlugins(res)
      setPluginsLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded && lngLoaded && pluginsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded, lngLoaded, pluginsLoaded])

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
        name="progress"
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
