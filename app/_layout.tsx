import { TimerProvider } from "@/context/TimerContext";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HistoryProvider } from "../context/HistoryContext";
import { ThemeProvider } from "../context/ThemeContext";
import { TimerControlProvider } from "../context/TimerControlContext";
import { initializeNotifications } from "../notification/notificationService";

export default function RootLayout() {
  useEffect(() => {
    initializeNotifications();
  }, []);
  return (
    <HistoryProvider>
      <TimerProvider>
        <TimerControlProvider>
          <ThemeProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen
                  name="index"
                  options={{ title: "Timer", headerShown: false }}
                />
                <Stack.Screen
                  name="history"
                  options={{ title: "History", headerShown: false }}
                />
                <Stack.Screen
                  name="add-timer"
                  options={{ title: "Add Timer", headerShown: false }}
                />
                <Stack.Screen
                  name="edit-timer"
                  options={{ title: "Edit Timer", headerShown: false }}
                />
                <Stack.Screen
                  name="categories"
                  options={{ title: "Categories", headerShown: false }}
                />
              </Stack>
            </SafeAreaView>
          </ThemeProvider>
        </TimerControlProvider>
      </TimerProvider>
    </HistoryProvider>
  );
}
