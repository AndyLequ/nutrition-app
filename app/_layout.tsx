import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import "@/global.css";
import { FoodProvider } from "./FoodProvider";
import { foodApi } from "../services/api";

export default function RootLayout() {
  const testFoodId = "33691"; // Replace with a valid food ID for testing

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log("Testing FatSecret API...");
        const results = await foodApi.getFatSecretFoodById(testFoodId);
        console.log("API Results:", results);
      } catch (error) {
        console.error("API Test Error:", error);
      }
    };
    testApi();
  }, []);

  return (
    <FoodProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </FoodProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
