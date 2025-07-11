import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Timer" }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="add-timer" options={{ title: "Add Timer" }} />
      <Stack.Screen name="edit-timer" options={{ title: "Edit Timer" }} />
      <Stack.Screen name="categories" options={{ title: "Categories" }} />
    </Stack>
  );
}
