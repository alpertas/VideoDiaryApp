import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { initDatabase } from "@/lib/database";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Initialize SQLite database on app start
  useEffect(() => {
    initDatabase().catch((error) => {
      console.error("Database initialization failed:", error);
    });
  }, []);

  return (
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
  );
}
