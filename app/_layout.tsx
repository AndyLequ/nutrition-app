import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import "@/global.css";
import { FoodProvider } from "./FoodProvider";
import { foodApi } from "../services/api";

export default function RootLayout() {

  useEffect(() => {
    const testApi = async() => {
      try {
        console.log("Testing FatSecret API...");
        const results = await foodApi.getFatSecretFoods({
          query: "chicken",
          maxResults: 2,
        })
        console.log('API Results:', results);
      } catch (error) {
        console.error("API Test Error:", error);
      }
    }
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
