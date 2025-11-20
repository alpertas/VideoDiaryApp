import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { initDatabase } from "@/lib/database";

// Create QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});


export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initDatabase().catch((error) => {
      console.error("Database initialization failed:", error);
    });
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: "Video Diary",
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="add"
              options={{
                presentation: "modal",
                title: "Add Video",
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="videos/[id]"
              options={{
                title: "Video Details",
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="edit/[id]"
              options={{
                presentation: "modal",
                title: "Edit Video",
                headerShown: true,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
