import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { FoodItem } from "../app/FoodProvider"; // Adjust the import based on your file structure

interface MealListProps {
  mealType: string;
  foodsForMealType: FoodItem[];
}

const MealList: React.FC<MealListProps> = ({ mealType, foodsForMealType }) => {
  return (
    <View style={styles.mealContainer}>
      <Text style={styles.titlename}>{mealType}</Text>
      <FlatList
        data={foodsForMealType}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
            <Text>{item.amount}</Text>
            <Text>Protein: {item.protein}g</Text>
            <Text>Calories: {item.calories} cal</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items found</Text>
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
