import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import type { MealType } from "../../services/types";
import { foodApi } from "../../services/api";

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

const initialMealData = [
  {
    date: "2023-12-04",
    meals: {
      breakfast: {
        items: [
          { id: "1a", name: "Oatmeal", calories: 150, protein: 5 },
          { id: "1b", name: "Banana", calories: 89, protein: 1 },
          { id: "1c", name: "Almond Milk", calories: 30, protein: 1 },
        ],
        totalCalories: 269,
        totalProtein: 7,
      },
      lunch: {
        items: [
          { id: "1d", name: "Grilled Chicken", calories: 300, protein: 30 },
          { id: "1e", name: "Quinoa", calories: 220, protein: 8 },
          { id: "1f", name: "Broccoli", calories: 55, protein: 4 },
        ],
        totalCalories: 575,
        totalProtein: 42,
      },
      dinner: {
        items: [
          { id: "1g", name: "Salmon", calories: 350, protein: 40 },
          { id: "1h", name: "Brown Rice", calories: 215, protein: 5 },
          { id: "1i", name: "Asparagus", calories: 20, protein: 2 },
        ],
        totalCalories: 585,
        totalProtein: 47,
      },
      snacks: {
        items: [
          { id: "1j", name: "Almonds", calories: 170, protein: 6 },
          { id: "1k", name: "Apple", calories: 95, protein: 0 },
        ],
        totalCalories: 265,
        totalProtein: 6,
      },
    },
  },
  // Add more days as needed...
];

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
                <Text className="text-slate-500">
                  {selectedMealType === mealType ? "▼" : "▶"}
                </Text>
              </TouchableOpacity>

              {/* new block here */}
              {selectedMealType === mealType && (
                <View className="ml-2 mt-2">
                  {/* search section */}
                  <View className="mb-4">
                    <TextInput
                      className="border rounded-lg p-2 mb-2"
                      placeholder="Search for recipes..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />

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
                      className="bg-white p-2 rounded mb-2"
                    >
                      <Text className="text-slate-800">{food.name}</Text>
                      <Text className="text-slate-500 text-sm">
                        {food.calories} cal • {food.protein}g protein
                      </Text>
                    </View>
                  ))}
                </View>
              )}
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
    </View>
  );
};

export default MealPlanList;
