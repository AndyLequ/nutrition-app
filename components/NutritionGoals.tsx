import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFood } from "../app/FoodProvider";

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
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Goals</Text>

      <View style={styles.goalsContainer}>
        <Text style={styles.goal}>
          Protein: {totalProtein}g / {proteinGoal}g
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${proteinProgress}%` }]}
          ></View>
        </View>

        <Text style={styles.goal}>
          Calories: {totalCalories} cal / {calorieGoal} cal
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${calorieProgress}%` }]}
          ></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  goalsContainer: {
    marginBottom: 20,
  },
  goal: {
    fontSize: 18,
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressBar: {
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#76c7c0",
    borderRadius: 10,
  },
  progressText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 16,
  },
});
