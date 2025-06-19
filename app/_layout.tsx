import { Slot } from "expo-router";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Slot />
      <Toast
        topOffset={Platform.OS === "ios" ? 70 : 10}
        visibilityTime={3000}
      />
    </SafeAreaProvider>
  );
}
