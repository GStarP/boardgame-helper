import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

// auto use error boundary
export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // splash screen (in-app loading animation)
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutView />;
}

function RootLayoutView() {
  return (
    <Stack
      screenOptions={{
        animation: "fade",
        animationDuration: 200,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "主页",
        }}
      />
      <Stack.Screen name="plugin" />
    </Stack>
  );
}
