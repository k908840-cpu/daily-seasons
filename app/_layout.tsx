import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppProvider, useApp } from "@/context/AppContext";

function RootNavigator() {
  const { settings, isDark } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!settings.onboardingComplete && segments[0] !== "onboarding") {
      router.replace("/onboarding");
    }
  }, [settings.onboardingComplete, segments, router]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="day/[season]/[day]" options={{ headerShown: true, title: "Today" }} />
        <Stack.Screen name="paywall" options={{ presentation: "modal", title: "Unlock" }} />
        <Stack.Screen name="sources" options={{ headerShown: true, title: "Sources" }} />
        <Stack.Screen name="rosary" options={{ headerShown: true, title: "Rosary" }} />
        <Stack.Screen name="timer" options={{ headerShown: true, title: "Prayer timer" }} />
        <Stack.Screen name="prayer/[id]" options={{ headerShown: true, title: "Prayer" }} />
      </Stack>
      </SafeAreaView>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
