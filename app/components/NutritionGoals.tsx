import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFood } from "../FoodProvider"; // Adjust the import based on your file structure

export const NutritionGoals = () => {
  const { foods } = useFood();

  const truncateToTwoDecimals = (num: number) => {
    return Math.trunc(num * 100) / 100;
  };
  const proteinGoal = 150; // Example goal
  const calorieGoal = 2000; // Example goal

  const totalProtein = truncateToTwoDecimals(
    foods.reduce((total, item) => total + item.protein, 0)
  );
  const totalCalories = truncateToTwoDecimals(
    foods.reduce((total, item) => total + item.calories, 0)
  );

  const proteinProgress = Math.min((totalProtein / proteinGoal) * 100, 100);
  const calorieProgress = Math.min((totalCalories / calorieGoal) * 100, 100);

  return (
    <View className="bg-white p-5 rounded-lg shadow-sm mb-4">
      <Text className="text-2x1 font-bold mb-5 text-gray-800">
        Nutrition Goals
      </Text>

      <View className="mb-5">
        <View className="mb-4">
          <Text className="text-lg mb-2.5 text-gray-700">
            Protein: {totalProtein}g / {proteinGoal}g
          </Text>
          <View className="h-5 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-teal-400 rounded-full"
              style={{ width: `${proteinProgress}%` }}
            ></View>
          </View>
        </View>

        <View>
          <Text className="text-lg mb-2.5 text-gray-700">
            Calories: {totalCalories} cal / {calorieGoal} cal
          </Text>
          <View className="h-5 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-orange-400 rounded-full"
              style={{ width: `${calorieProgress}%` }}
            ></View>
          </View>
        </View>
      </View>
    </View>
  );
};
