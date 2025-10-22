import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="Sessions" options={{ headerShown: false }} />
      <Stack.Screen name="DocumentsSubmitted" options={{ headerShown: false }} />
      <Stack.Screen name="AddChild" options={{ headerShown: false }} />
      <Stack.Screen name="BackgroundCheck" options={{ headerShown: false }} />
      <Stack.Screen name="BookSession" options={{ headerShown: false }} />
      <Stack.Screen name="ChildProfile" options={{ headerShown: false }} />
      <Stack.Screen name="DriverRegistration" options={{ headerShown: false }} />
      <Stack.Screen name="DriverTrips" options={{ headerShown: false }} />
      <Stack.Screen name="MyChildren" options={{ headerShown: false }} />
      <Stack.Screen name="NannyRegistration" options={{ headerShown: false }} />
      <Stack.Screen name="NannySessions" options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" options={{ headerShown: false }} />
      <Stack.Screen name="ParentRegistration" options={{ headerShown: false }} />
      <Stack.Screen name="Registration" options={{ headerShown: false }} />
      <Stack.Screen name="TestBackend" options={{ headerShown: false }} />
    </Stack>
  );
}