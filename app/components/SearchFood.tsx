import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Pressable,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFood } from "../FoodProvider";
import debounce from "lodash.debounce";
import axios from "axios";
import { foodApi } from "../../services/api";
import DropDownPicker from "react-native-dropdown-picker";

interface UnifiedSearchResult {
  id: number;
  name: string;
  type: "ingredient" | "recipe";
  source?: "spoonacular" | "fatsecret";
  baseAmount?: number;
  baseUnit?: string;
  servings?: number;
  nutrition?: any; // Adjust this type based on your API response
  fatSecretData?: any;
}

export const SearchFood = () => {
  //the state variables, these states are concerned with the food being searched and then added
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("g");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snacks"
  >("breakfast");
  const [unitOpen, setUnitOpen] = useState(false);
  const [mealTypeOpen, setMealTypeOpen] = useState(false);
  const [unitItems, setUnitItems] = useState([
    { label: "g", value: "g" },
    { label: "oz", value: "oz" },
    { label: "ml", value: "ml" },
    { label: "serving", value: "serving" },
  ]);
  const [mealTypeItems, setMealTypeItems] = useState([
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "Snacks", value: "snacks" },
  ]);

  //: state variables for handling data regarding the food that is written in the search bar
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<
    (UnifiedSearchResult & { servingSizeGrams?: number }) | null
  >(null);

  const [showSuccess, setShowSuccess] = useState(false);

  // these states are for later use, not important right now
  // const [submittedFoods, setSubmittedFoods] = useState([]);
  // const [showFoodList, setShowFoodList] = useState(false);
  const { addFood } = useFood();

  const convertToServings = (
    amount: number,
    unit: string,
    servingSizeGrams: number
  ): number => {
    const conversions: { [key: string]: number } = {
      g: 1,
      oz: 28.3495,
      ml: 1,
    };
    if (unit === "serving") return amount;
    if (!conversions[unit]) return 1;

    const grams = amount * conversions[unit];
    return grams / servingSizeGrams;
  };

  // function for searching for food, will be called when the user types in the search bar
  // this function will be debounced to avoid making too many requests to the API
  // ADDING fatsecret API search here too
  const debouncedSearch = debounce(async (query) => {
    if (query.length > 2) {
      try {
        const results = await Promise.allSettled([
          foodApi.searchIngredients({
            query,
            limit: 1,
            sort: "calories",
            sortDirection: "desc",
          }),
          foodApi.searchRecipes({
            query,
            limit: 1,
            sort: "calories",
            sortDirection: "desc",
          }),
          foodApi.getFatSecretFoods({ query, maxResults: 1, pageNumber: 0 }),
          foodApi.getFatSecretRecipes({ query, maxResults: 1, pageNumber: 0 }),
        ]);

        const [
          ingredientsResponse,
          recipesResponse,
          fatSecretFoodsResponse,
          fatSecretRecipesResponse,
        ] = results.map((result) =>
          result.status === "fulfilled" ? result.value : []
        );

        //mapping results properly

        // spoonacular results
        const ingredientResults = Array.isArray(ingredientsResponse)
          ? ingredientsResponse.map((item) => ({
              id: item.id,
              name: item.name,
              type: "ingredient" as const,
              source: "spoonacular" as const,
            }))
          : [];

          // note: spoonacular recipe mapping is misaligned 
        const recipeResults = Array.isArray(recipesResponse) ? recipesResponse.map((item) => ({
          id: item.id,
          name: item.title, 
          type: "recipe" as const,
          source: "spoonacular" as const,
        }));

        // fatsecret results
        const fatSecretResults = fatSecretFoodsResponse.map((item) => ({
          id: item.id,
          name: item.name,
          type: "ingredient" as const, // mapping fatsecret foods to "ingredient" type
          source: "fatsecret", //adding a source field to distinguish
          baseAmount: 100,
          baseUnit: "g",
        }));

        const fatSecretRecipeResults = fatSecretRecipesResponse.map((item) => ({
          id: item.id,
          name: item.name,
          type: "recipe" as const, // mapping fatsecret recipes to "recipe" type,
          source: "fatsecret" as const, // adding a source field to distinguish
          nutrition: item.nutrition,
          servings: 1,
        }));

        // Handle successful responses
        const allResults = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
          .flat();

        setSearchResults([
          ...ingredientResults,
          ...recipeResults,
          ...fatSecretResults,
          ...fatSecretRecipeResults,
        ]);

        console.log("Search results:", {
          query,
          spoonacularIngredients: ingredientResults.length,
          spoonacularRecipes: recipeResults.length,
          fatSecretFoods: fatSecretResults.length,
          fatSecretRecipes: fatSecretRecipeResults.length,
          allResults: searchResults,
        });
      } catch (error) {
        console.error("Error fetching data from spoonacular API", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, 500);

  //
  // function to handle search input
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) return setSearchResults([]);

    setIsSearching(true);
    debouncedSearch(query);
  };

  // function to handle food selection
  const handleFoodSelect = async (food: UnifiedSearchResult) => {
    setSelectedFood(food);
    setSearchQuery(food.name);
    setSearchResults([]);

    // debug log to verify selected food details
    console.log("Selected food:", {
      name: food.name,
      type: food.type,
      source: food.source,
      id: food.id,
    });

    // new logic for handling both spoonacular and fatsecret APIs
    if (food.source === "fatsecret" && food.type === "recipe") {
      try {
        const recipeDetails = await foodApi.getFatSecretRecipeById(
          food.id.toString()
        );
        setSelectedFood({
          ...food,
          fatSecretData: recipeDetails,
          servingSizeGrams: recipeDetails.servingSizeGrams, // assuming 100g for fatsecret recipes, adjust as needed
        });
      } catch (error) {
        console.error("Error fetching FatSecret recipe details", error);
        setSelectedFood({
          ...food,
          servingSizeGrams: 100,
        });
      }
    }
    // for fatsecret ingredients, need to fetch details
    else if (food.source === "fatsecret" && food.type === "ingredient") {
      try {
        const foodDetails = await foodApi.getFatSecretFoodById(
          food.id.toString()
        );
        setSelectedFood({
          ...food,
          fatSecretData: foodDetails,
          servingSizeGrams: (foodDetails as any).servingSizeGrams || 100,
        });
      } catch (error) {
        console.error("Error fetching FatSecret food details", error);
        setSelectedFood(food);
      }
    } else {
      setSelectedFood(food);
    }

    setUnit(food.type === "recipe" ? "serving" : "g");

    // For FatSecret items, log the detailed data
    if (food.source === "fatsecret") {
      console.log("FatSecret details:", food.fatSecretData);
    }
  };
  const parseNutritionValue = (value: string) => {
    parseFloat(value.replace(/[^\d.]/g, ""));
  };

  // helper function to convert various units to grams
  const convertToGrams = (
    amount: number,
    unit: string,
    servingSizeGrams: number = 100
  ): number => {
    const conversions: { [key: string]: number } = {
      g: 1,
      oz: 28.3495,
      ml: 1, // assuming density similar to water for simplicity
      serving: servingSizeGrams,
    };
    return conversions[unit] ? amount * conversions[unit] : amount;
  };

  // function to handle form submission
  // this function will be called when the user clicks the submit button
  // this needs to be changed to account for the nutrition data being fetched from the API
  const handleSubmit = async () => {
    if (!selectedFood || !amount) return;

    try {
      let nutrition;

      if (selectedFood.source === "fatsecret") {
        if (!selectedFood.fatSecretData) {
          throw new Error("FatSecret data not available");
        }

        if (selectedFood.type === "ingredient") {
          // fatsecret ingredients
          const foodDetails = selectedFood.fatSecretData;
          const amountInGrams = convertToGrams(parseFloat(amount), unit);

          // debug log to verify calculation steps
          console.log("Nutrition Calculation Start:", {
            selectedFood: {
              name: selectedFood.name,
              type: selectedFood.type,
              source: selectedFood.source,
              servingSizeGrams: selectedFood.servingSizeGrams,
              fatSecretData: selectedFood.fatSecretData ? "exists" : "missing",
            },
            amount,
            unit,
          });

          nutrition = {
            protein: foodDetails.perGram.protein * amountInGrams,
            calories: foodDetails.perGram.calories * amountInGrams,
            carbs: foodDetails.perGram.carbs * amountInGrams,
            fat: foodDetails.perGram.fat * amountInGrams,
            amount: parseFloat(amount),
            unit,
          };
        } else {
          // fatsecret recipes
          const recipeDetails = selectedFood.fatSecretData;
          const amountInGrams = convertToGrams(
            parseFloat(amount),
            unit,
            selectedFood.servingSizeGrams || 100
          );

          nutrition = {
            protein: recipeDetails.nutritionPerGram.protein * amountInGrams,
            calories: recipeDetails.nutritionPerGram.calories * amountInGrams,
            carbs: recipeDetails.nutritionPerGram.carbs * amountInGrams,
            fat: recipeDetails.nutritionPerGram.fat * amountInGrams,
            amount: parseFloat(amount),
            unit,
          };
        }
      } else if (selectedFood.type === "ingredient") {
        // spoonacular ingredient
        nutrition = await foodApi.getNutrition(
          selectedFood.id,
          parseFloat(amount),
          unit
        );
      } else {
        // spoonacular recipes
        const servings = convertToServings(
          parseFloat(amount),
          unit,
          selectedFood.servingSizeGrams || 100
        );

        const baseNutrition = await foodApi.getRecipeNutrition(selectedFood.id);
        nutrition = {
          protein: baseNutrition.protein * servings,
          calories: baseNutrition.calories * servings,
          carbs: baseNutrition.carbs * servings,
          fat: baseNutrition.fat * servings,
          amount: parseFloat(amount),
          unit,
        };
      }

      // debug log to verify nutrition calculation
      console.log("Final nutrition calculation:", {
        name: selectedFood.name,
        source: selectedFood.source,
        type: selectedFood.type,
        nutrition: nutrition,
        amount: amount,
        unit: unit,
      });

      await addFood({
        name: selectedFood.name,
        amount:
          nutrition.unit === "serving"
            ? `${nutrition.amount} ${
                nutrition.amount === 1 ? "serving" : "servings"
              }`
            : `${nutrition.amount} ${nutrition.unit}`,
        mealType,
        protein: Number(nutrition.protein),
        calories: Number(nutrition.calories),
        carbs: Number(nutrition.carbs),
        fat: Number(nutrition.fat),
      });

      setSearchQuery("");
      setAmount("");
      setUnit("g");
      setMealType("breakfast");
      setSelectedFood(null);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000); // Hide success message after 2 seconds

      await AsyncStorage.removeItem("@inputs"); // Clear saved data

      // Reset form...
    } catch (error) {
      Alert.alert("Error", "Failed to save food entry");
    }
  };

  useEffect(() => {
    if (selectedFood?.type === "recipe") {
      setUnitItems([
        { label: "g", value: "g" },
        { label: "oz", value: "oz" },
        { label: "ml", value: "ml" },
        { label: "serving", value: "serving" },
      ]);
    } else {
      setUnitItems([
        { label: "g", value: "g" },
        { label: "oz", value: "oz" },
        { label: "ml", value: "ml" },
      ]);
    }
  }, [selectedFood?.type]);

  // useEffect to load data from async storage
  useEffect(() => {
    const loadData = async () => {
      // Load data here
      try {
        const savedData = await AsyncStorage.getItem("data");
        if (savedData !== null) {
          const { savedfoodName, savedAmount, savedMealType } =
            JSON.parse(savedData);
          setSearchQuery(savedfoodName);
          setAmount(savedAmount);
          setMealType(savedMealType || "breakfast");
        }
      } catch (e) {
        console.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // useEffect to save data to async storage
  useEffect(() => {
    if (!isLoading) {
      const saveData = async () => {
        try {
          const dataToSave = JSON.stringify({
            searchQuery,
            amount,
            mealType,
            unit,
            foodType: selectedFood?.type,
          });
          await AsyncStorage.setItem("@inputs", dataToSave);
        } catch (e) {
          console.error("Failed to save data");
        }
      };
      saveData();
    }
  }, [searchQuery, amount, mealType, isLoading, unit, selectedFood?.type]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const dismissKeyboardAndCloseDropdowns = () => {
    Keyboard.dismiss();
    closeAllDropdowns();
  };

  const closeAllDropdowns = () => {
    setUnitOpen(false);
    setMealTypeOpen(false);
  };

  // return the form to add food
  return (
    <Pressable
      style={{ flex: 1, backgroundColor: "white" }}
      onPress={dismissKeyboardAndCloseDropdowns}
    >
      <View className="flex-1 bg-gray-100 justify-center p-5">
        <View className="bg-white rounded-lg p-6 shadow-md">
          <Text className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Add Food
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm text-gray-600 mb-2">Search Food</Text>
              <TextInput
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused1 ? "border-indigo-500" : "border-gray-300"
                }`}
                placeholder="Search for food..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={handleSearch}
                onFocus={() => {
                  setIsFocused1(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused1(false)}
              />
            </View>

            {searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-3 border-b border-gray-300"
                    onPress={() => {
                      handleFoodSelect(item);
                    }}
                  >
                    <Text className="text-gray-800">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">
                      {item.type === "ingredient" ? "Ingredient" : "Recipe"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <View>
              <Text className="text-sm text-gray-600 mb-2">Amount</Text>
              <TextInput
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused2 ? "border-indigo-500" : "border-gray-300"
                }`}
                placeholder="Enter amount (e.g., 100)"
                placeholderTextColor="#94a3b8"
                value={amount}
                onChangeText={setAmount}
                onFocus={() => {
                  setIsFocused2(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused2(false)}
              />
            </View>

            <View style={{ zIndex: 1000, elevation: 1000 }}>
              <Text className="text-sm text-gray-600 mb-2">Units</Text>

              <DropDownPicker
                open={unitOpen}
                value={unit}
                items={unitItems}
                setOpen={(open) => {
                  Keyboard.dismiss();
                  setUnitOpen(open);
                }}
                setValue={setUnit}
                setItems={setUnitItems}
                style={{
                  borderColor: "#cbd5e1",
                  borderRadius: 8,
                }}
                dropDownContainerStyle={{
                  borderColor: "#cbd5e1",
                }}
              />
            </View>

            {/* Meal Type Dropdown */}
            <View style={{ zIndex: 999, elevation: 999 }}>
              <Text className="text-sm text-gray-600 mb-2">Meal Type</Text>
              <DropDownPicker
                open={mealTypeOpen}
                value={mealType}
                items={mealTypeItems}
                setOpen={(open) => {
                  Keyboard.dismiss();
                  setMealTypeOpen(open);
                }}
                setValue={setMealType}
                setItems={setMealTypeItems}
                style={{
                  borderColor: "#cbd5e1",
                  borderRadius: 8,
                }}
                dropDownContainerStyle={{
                  borderColor: "#cbd5e1",
                }}
              />
            </View>

            <View className="mt-4">
              <TouchableOpacity
                className="h-12 bg-indigo-500 rounded-lg justify-center items-center"
                onPress={handleSubmit}
              >
                <Text className="text-white text-base font-semibold">
                  Submit
                </Text>
              </TouchableOpacity>

              {showSuccess && (
                <View className="mt-2 p-2 bg-green-100 rounded-md">
                  <Text>
                    Food added successfully!{" "}
                    <Text className="text-green-500">✓</Text>
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
