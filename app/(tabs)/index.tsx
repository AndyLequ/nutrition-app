import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { useFood } from "../FoodProvider";
import { NutritionGoals } from "../components/NutritionGoals";

export default function Index() {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [calories, setCalories] = useState(0);
  const [fat, setFat] = useState(0);

  const { foods } = useFood();
  const safeFoods = Array.isArray(foods) ? foods : [];

  useEffect(() => {
    const truncateToTwoDecimals = (num: number) => {
      return Math.trunc(num * 100) / 100;
    };

    const totalProtein = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.protein || 0), 0)
    );
    const totalCalories = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.calories || 0), 0)
    );
    const totalCarbs = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.carbs || 0), 0)
    );
    const totalFat = truncateToTwoDecimals(
      safeFoods.reduce((sum, food) => sum + (food.fat || 0), 0)
    );

    setProtein(totalProtein);
    setCalories(totalCalories);
    setCarbs(totalCarbs);
    setFat(totalFat);
  }, [safeFoods]);

  return (
    <View className="p-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-bold mb-4 text-gray-800">Summary</Text>
      <View className="flex-row justify-between">
        <View className="items-center px-3">
          <Text className="text-sm text-gray-500 mb-1">Protein</Text>
          <Text className="text-base font-medium text-gray-800">{protein}</Text>
        </View>
        <View className="items-center px-3">
          <Text className="text-sm text-gray-500 mb-1">Calories</Text>
          <Text className="text-base font-medium text-gray-800">
            {calories}
          </Text>
        </View>
        <View className="items-center px-3">
          <Text className="text-sm text-gray-500 mb-1">Carbs</Text>
          <Text className="text-base font-medium text-gray-800">{carbs}</Text>
        </View>
        <View className="items-center px-3">
          <Text className="text-sm text-gray-500 mb-1">Fat</Text>
          <Text className="text-base font-medium text-gray-800">{fat}</Text>
        </View>
      </View>

      {/* Nutrition Goals */}
      <NutritionGoals />
    </View>
  );
}
