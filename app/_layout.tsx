import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import "@/global.css";
import { FoodProvider } from "./FoodProvider";
import { foodApi } from "../services/api";

interface NutritionInfo {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
}

interface RecipeData {
  id: string;
  name: string;
  nutritionPerServing: NutritionInfo;
  nutritionPerGram: NutritionInfo;
}

export default function RootLayout() {
  useEffect(() => {
    const logRecipeData = async () => {
      console.log("Testing FatSecret recipe API connection...");

      try {
        const testRecipeId = "106050235";
        // Add type assertion here
        const recipeData = (await foodApi.getFatSecretRecipeById(
          testRecipeId
        )) as unknown as RecipeData;

        console.log("=== RECIPE DATA ===");
        console.log("ID:", recipeData.id);
        console.log("Name:", recipeData.name);
        // ... rest of your logging code
      } catch (error) {
        console.error("API call failed:", error);
      }
    };

    logRecipeData();
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
