import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import "@/global.css";
import { FoodProvider } from "./FoodProvider";
import { foodApi } from "../services/api";

export default function RootLayout() {
  useEffect(() => {
    const testApiConnection = async () => {
      console.log("Testing FatSecret API connection...");
      const testRecipeId = "106050235"; // Example recipe ID for testing
      try {
        const recipe = await foodApi.getFatSecretRecipeById(testRecipeId);
        console.log("API call successful! Recieved recipes:", recipe);

        if (recipe && recipe.recipe_id) {
          console.log(`Recipe details:`, {
            name: recipe.recipe_name,
            calories: recipe.recipe_nutrition?.calories,
            protein: recipe.recipe_nutrition?.protein,
            carbs: recipe.recipe_nutrition?.carbohydrate,
            fat: recipe.recipe_nutrition?.fat,
          });
        } else {
          console.error("Unexpected response format:", recipe);
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    };

    testApiConnection();
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
