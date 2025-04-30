import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import type { MealType } from "../../services/types";
import { foodApi } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Recipe {
  id: number;
  title: string;
  servings: number;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const generateWeek = () => {
  const days = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Set time to midnight

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    days.push({
      date: currentDate.toISOString().split("T")[0],
      meals: {
        breakfast: { items: [], totalCalories: 0, totalProtein: 0 },
        lunch: { items: [], totalCalories: 0, totalProtein: 0 },
        dinner: { items: [], totalCalories: 0, totalProtein: 0 },
        snacks: { items: [], totalCalories: 0, totalProtein: 0 },
      },
    });
  }
  return days;
};

const initialMealData = generateWeek();

const MealPlanList = () => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(
    null
  );
  const [mealPlans, setMealPlans] = useState(initialMealData);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [amount, setAmount] = useState("1");
  const displayPlans = mealPlans.length > 0 ? mealPlans : initialMealData;

  const STORAGE_KEY = "@MealPlanList:mealPlans";

  useEffect(() => {
    const loadMealPlans = async () => {
      try {
        const storedMealPlans = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedMealPlans) {
          setMealPlans(JSON.parse(storedMealPlans));
        }
      } catch (error) {
        console.error("Failed to load meal plans from storage:", error);
      }
    };
    loadMealPlans();
  }, []);

  useEffect(() => {
    const saveMealPlans = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mealPlans));
      } catch (error) {
        console.error("Failed to save meal plans to storage:", error);
      }
    };
    saveMealPlans();
  }, [mealPlans]);

  //recipe search handling
  useEffect(() => {
    const searchRecipes = async () => {
      if (searchQuery.length > 2) {
        setLoading(true);
        try {
          const response = await foodApi.searchRecipes({
            query: searchQuery,
            limit: 1,
          });
          setSearchResults(response);
        } catch (err) {
          setError("Failed to fetch recipes. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    const debounceTimer = setTimeout(searchRecipes, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  //handle recipe select
  const handleRecipeSelect = async (recipe: Recipe) => {
    try {
      setError(null);
      const nutrition = await foodApi.getRecipeNutrition(recipe.id);
      setSelectedRecipe({
        ...recipe,
        nutrition: {
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
        },
      });
    } catch (error) {
      setError("Failed to fetch recipe nutrition. Please try again.");
    }
  };

  //add recipe to meal plan
  const addRecipeToMealPlan = async () => {
    if (!selectedRecipe?.nutrition || !selectedDay || !selectedMealType) return;

    const parsedAmount = parseFloat(amount) || 1;
    const newItem = {
      id: `recipe-${selectedRecipe.id}`,
      name: selectedRecipe.title,
      calories: selectedRecipe.nutrition.calories * parsedAmount,
      protein: selectedRecipe.nutrition.protein * parsedAmount,
    };

    setMealPlans((prev) =>
      prev.map((day) => {
        if (day.date === selectedDay) {
          return {
            ...day,
            meals: {
              ...day.meals,
              [selectedMealType]: {
                ...day.meals[selectedMealType],
                items: [...day.meals[selectedMealType].items, newItem],
                totalCalories:
                  day.meals[selectedMealType].totalCalories + newItem.calories,
                totalProtein:
                  day.meals[selectedMealType].totalProtein + newItem.protein,
              },
            },
          };
        }
        return day;
      })
    );
    setSelectedRecipe(null);
    setSearchResults([]);
  };

  const toggleDay = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date);
    setSelectedMealType(null);
  };

  const deleteMealItem = (day: string, mealType: MealType, mealId: string) => {
    setMealPlans((prev) =>
      prev.map((dayPlan) => {
        if (dayPlan.date === day) {
          const updatedItem = dayPlan.meals[mealType].items.filter(
            (item) => item.id !== mealId
          );

          const totalCalories = updatedItem.reduce(
            (sum, item) => sum + item.calories,
            0
          );
          const totalProtein = updatedItem.reduce(
            (sum, item) => sum + item.protein,
            0
          );
          return {
            ...dayPlan,
            meals: {
              ...dayPlan.meals,
              [mealType]: {
                ...dayPlan.meals[mealType],
                items: updatedItem,
                totalCalories: totalCalories,
                totalProtein: totalProtein,
              },
            },
          };
        }
        return dayPlan;
      })
    );
  };

  const clearAllMeals = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setMealPlans(initialMealData);
      //reset any related states
      setSelectedRecipe(null);
      setSearchResults([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to clear meal plans:", error);
    }
  };

  const confirmClear = () => {
    Alert.alert(
      "Clear All Meals",
      "Are you sure you want to delete all meal entries?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", onPress: clearAllMeals, style: "destructive" },
      ]
    );
  };

  const renderDay = ({ item }: { item: (typeof mealPlans)[0] }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <TouchableOpacity
        onPress={() => {
          toggleDay(item.date);
          setSelectedDay(item.date);
        }}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold text-slate-800">
            {new Date(item.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>
          <Text className="text-slate-400 text-lg">
            {expandedDay === item.date ? "▼" : "▶"}
          </Text>
        </View>
      </TouchableOpacity>

      {expandedDay === item.date && (
        <View className="mt-3">
          {Object.entries(item.meals).map(([mealType, meal]) => (
            <View key={mealType} className="mb-4">
              <TouchableOpacity
                className="flex-row justify-between items-center bg-slate-50 p-2 rounded"
                onPress={() => setSelectedMealType(mealType as MealType)}
              >
                <Text className="font-medium text-slate-800">{mealType}</Text>
              </TouchableOpacity>

              {/* new block here */}

              <View className="ml-2 mt-2">
                {/* search section */}
                <TextInput
                  className="border rounded-lg p-2 mb-2"
                  placeholder="Search for recipes..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <View className="mb-4">
                  {loading && <ActivityIndicator size="small" />}
                  {error && (
                    <Text className="text-red-500 text-sm">{error}</Text>
                  )}

                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="p-2 border-b border-gray-100"
                        onPress={() => handleRecipeSelect(item)}
                      >
                        <Text className="text-base">{item.title}</Text>
                        <Text className="text-sm text-gray-500">
                          {item.servings} servings
                        </Text>
                      </TouchableOpacity>
                    )}
                  />

                  {selectedRecipe && (
                    <View className="mt-4">
                      <TextInput
                        className="border rounded-lg p-2 mb-2"
                        placeholder="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity
                        className="bg-blue-500 p-2 rounded-lg"
                        onPress={addRecipeToMealPlan}
                      >
                        <Text className="text-white text-center">
                          Add {selectedRecipe.title}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {/* existing meal items */}
                {meal.items.map((food, index) => (
                  <View
                    key={`${food.id}-${index}`}
                    className="bg-white p-2 rounded mb-2 flex-row justify-between items-center shadow-sm border border-gray-200"
                  >
                    <View>
                      <Text className="text-slate-800">{food.name}</Text>
                      <Text className="text-slate-500 text-sm">
                        {food.calories} cal • {food.protein}g protein
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="bg-red-500 px-3 py-1 rounded"
                      onPress={() =>
                        deleteMealItem(item.date, mealType as MealType, food.id)
                      }
                    >
                      <Text className="text-white text-sm font-bold">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-slate-50">
      <Text className="text-2xl font-bold text-center text-slate-800 mb-4">
        Weekly Meal Plan
      </Text>

      <FlatList
        data={mealPlans}
        renderItem={renderDay}
        keyExtractor={(item) => item.date}
        ListEmptyComponent={
          <Text className="text-center text-slate-500">
            No meal plans created yet. Start by adding meals to days!
          </Text>
        }
      />
      <TouchableOpacity
        onPress={confirmClear}
        className="bg-red-500 px-4 py-2 rounded-lg justify-center items-center"
      >
        <Text className="text-white font-medium">Clear All</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MealPlanList;
