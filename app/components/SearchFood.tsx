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

import { FoodItem } from "../FoodProvider";

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
  ]);
  const [mealTypeItems, setMealTypeItems] = useState([
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "Snacks", value: "snacks" },
  ]);

  //: state variables for handling data regarding the food that is written in the search bar
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Ingredient | null>(null);

  // these states are for later use, not important right now
  // const [submittedFoods, setSubmittedFoods] = useState([]);
  // const [showFoodList, setShowFoodList] = useState(false);
  const { addFood } = useFood();

  //:
  // function for searching for food, will be called when the user types in the search bar
  // this function will be debounced to avoid making too many requests to the API
  const debouncedSearch = debounce(async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/food/ingredients/search?query=${query}&number=2&sort=calories&sortDirection=desc`,
          {
            headers: {
              "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
            },
          }
        );
        setSearchResults(response.data.results || []);
        console.log("Search results:", response.data.results);
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

  //:
  // function to handle search input
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) return setSearchResults([]);

    setIsSearching(true);
    debouncedSearch(query);
  };

  // function to handle food selection
  const handleFoodSelect = (food: Ingredient) => {
    setSelectedFood(food);
    setSearchQuery(food.name);
    setSearchResults([]);
    // foodApi.getNutrition(food.id, amount, unit).then((nutrition) => {
    //   console.log("Nutrition data:", nutrition);
    // });
    console.log("Selected food:", food);
  };

  // function to handle form submission
  // this function will be called when the user clicks the submit button
  // this needs to be changed to account for the nutrition data being fetched from the API
  const handleSubmit = async () => {
    if (!selectedFood || !amount) return;

    try {
      // Get final nutrition for actual amount
      const nutrition = await foodApi.getNutrition(
        selectedFood.id,
        parseFloat(amount),
        unit
      );

      await addFood({
        name: selectedFood.name,
        amount: `${nutrition.amount}${nutrition.unit}`,
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

      await AsyncStorage.removeItem("@inputs"); // Clear saved data

      // Reset form...
    } catch (error) {
      Alert.alert("Error", "Failed to save food entry");
    }
  };

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
          });
          await AsyncStorage.setItem("@inputs", dataToSave);
        } catch (e) {
          console.error("Failed to save data");
        }
      };
      saveData();
    }
  }, [searchQuery, amount, mealType, isLoading]);

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
                placeholder="Enter amount (e.g., 100g)"
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
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
