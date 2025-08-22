import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import "@/global.css";
import { FoodProvider } from "./FoodProvider";
import { foodApi } from "../services/api";

export default function RootLayout() {
  useEffect(() => {
    const testRecipeSearch = async () => {
      try {
        const recipes = await foodApi.getFatSecretRecipes("chicken", 3, 0);
        console.log("API call successful! Recieved recipes:", recipes);

        if (recipes && Array.isArray(recipes)) {
          console.log(`Received ${recipes.length} recipes`);
          recipes.forEach((recipe) => {
            console.log(`- ${recipe.recipe_name} (ID: ${recipe.recipe_id})`);
          });
        } else {
          console.error("Unexpected response format:", recipes);
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    };

    testRecipeSearch();
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
