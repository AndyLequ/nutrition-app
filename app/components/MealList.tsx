import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { FoodItem } from "../FoodProvider"; // Adjust the import based on your file structure

interface MealListProps {
  mealType: string;
  foodsForMealType: FoodItem[];
}

const MealList: React.FC<MealListProps> = ({ mealType, foodsForMealType }) => {
  return (
    <View className="bg-white shadow-md rounded-lg p-4 mb-4">
      <FlatList
        data={foodsForMealType}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border-b border-gray-300 py-2">
            <Text className="text-lg font-semibold text-gray-800">
              {item.name}
            </Text>
            <Text className="text-gray-600">{item.amount}</Text>
            <Text className="text-gray-600">Protein: {item.protein}g</Text>
            <Text className="text-gray-600">Calories: {item.calories} cal</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-4">No items found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
  mealContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  titlename: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2c3e50",
  },
});

export default MealList;
