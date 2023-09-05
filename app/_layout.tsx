import { TITLE_HOME, TITLE_PROGRESS, TITLE_REGISTRY } from '@/i18n'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { SheetProvider } from 'react-native-actions-sheet'

// auto use error boundary
export { ErrorBoundary } from 'expo-router'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  // splash screen (in-app loading animation)
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

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
  return (
    <Stack
      screenOptions={{
        animation: 'fade',
        animationDuration: 200,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: TITLE_HOME,
        }}
      />
      <Stack.Screen name="plugin" />
      <Stack.Screen
        name="registry"
        options={{
          title: TITLE_REGISTRY,
        }}
      />
      <Stack.Screen
        name="progress"
        options={{
          title: TITLE_PROGRESS,
        }}
      />
    </Stack>
  )
}
