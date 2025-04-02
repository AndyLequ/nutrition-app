import { Text, View, StyleSheet, FlatList } from "react-native";
import React from "react";
import { useFood } from "../FoodProvider";
import MealList from "../components/MealList";
// display somewhere in this page the data input into the addfood page
// display the data input into the addfood page in a list format

export default function LogScreen() {
  const { foods, loading } = useFood();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  
  return (
    <View style={styles.container}>
      <View style={styles.columnContainer}>
        {/* Meal Sections */}
        <View style={styles.mealContainer}>
          <Text style={styles.titlename}>Breakfast</Text>
          <MealList
            mealType="breakfast"
            foodsForMealType={foods.filter(
              (food) => food.mealType === "breakfast"
            )}
          />
        </View>

        <View style={styles.mealContainer}>
          <Text style={styles.titlename}>Lunch</Text>
          <MealList
            mealType="lunch"
            foodsForMealType={foods.filter((food) => food.mealType === "lunch")}
          />
        </View>

        <View style={styles.mealContainer}>
          <Text style={styles.titlename}>Dinner</Text>
          <MealList
            mealType="dinner"
            foodsForMealType={foods.filter(
              (food) => food.mealType === "dinner"
            )}
          />
        </View>

        <View style={styles.mealContainer}>
          <Text style={styles.titlename}>Snacks</Text>
          <MealList
            mealType="snacks"
            foodsForMealType={foods.filter(
              (food) => food.mealType === "snacks"
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  columnContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  mealContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  titlename: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  listItem: {
    paddingVertical: 4,
  },
});
