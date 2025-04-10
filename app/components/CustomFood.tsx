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

export const CustomFood = () => {
  const [customFood, setCustomFood] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [protein, setProtein] = useState("");
  const [calories, setCalories] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);
  const [isFocused4, setIsFocused4] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("g");
  const [unitItems, setUnitItems] = useState([
    { label: "g", value: "g" },
    { label: "oz", value: "oz" },
    { label: "ml", value: "ml" },
  ]);
  const [unitOpen, setUnitOpen] = useState(false);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snacks"
  >("breakfast");
  const [mealTypeOpen, setMealTypeOpen] = useState(false);
  const [mealTypeItems, setMealTypeItems] = useState([
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "Snacks", value: "snacks" },
  ]);

  const dismissKeyboardAndCloseDropdowns = () => {
    Keyboard.dismiss();
    closeAllDropdowns();
  };

  const closeAllDropdowns = () => {
    setUnitOpen(false);
    setMealTypeOpen(false);
  };

  // function to handle custom food submission

  return (
    <Pressable
      style={{ flex: 1, backgroundColor: "white" }}
      onPress={dismissKeyboardAndCloseDropdowns}
    >
      <View className="flex-1 bg-gray-100 justify-center p-5">
        <View className="flex-1 bg-gray-100 justify-center p-5">
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
                value={foodName}
                onChangeText={setFoodName}
                onFocus={() => {
                  setIsFocused1(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused1(false)}
              />
            </View>

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

            {/* protein input */}
            <View className="text-sm text-gray-600 mb-2">
              Protein
              <TextInput
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused3 ? "border-indigo-500" : "border-gray-300"
                }`}
                placeholder="Enter protein"
                placeholderTextColor="#94a3b8"
                value={protein}
                onChangeText={setProtein}
                onFocus={() => {
                  setIsFocused3(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused3(false)}
              />
            </View>

            {/* calorie input */}
            <View className="text-sm text-gray-600 mb-2">
              Calories
              <TextInput
                className={`h-12 border rounded-lg px-4 text-base text-gray-900 ${
                  isFocused4 ? "border-indigo-500" : "border-gray-300"
                }`}
                placeholder="Enter calories"
                placeholderTextColor="#94a3b8"
                value={calories}
                onChangeText={setCalories}
                onFocus={() => {
                  setIsFocused4(true);
                  closeAllDropdowns();
                }}
                onBlur={() => setIsFocused4(false)}
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
          </View>
        </View>
      </View>
    </Pressable>
  );
};
