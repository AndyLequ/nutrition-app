import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFood } from "../app/FoodProvider";

export const NutritionGoals = () => {
  const { foods } = useFood();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Goals</Text>
      <View style={styles.goalsContainer}>
        <Text style={styles.goal}>Protein: {foods.protein}g</Text>
        <Text style={styles.goal}>Carbs: {foods.carbs}g</Text>
        <Text style={styles.goal}>Fat: {foods.fat}g</Text>
        <Text style={styles.goal}>Calories: {foods.calories} kcal</Text>
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Progress</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(foods.protein / foods.calories) * 100}%` },
            ]}
          />
        </View>
        <Text
          style={styles.progressText}
        >{`${foods.protein} / ${foods.calories} kcal`}</Text>
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
