import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import MealPlanList from "@/components/MealPlanList";
import axios from "axios";
import { useFood } from "../FoodProvider";
const data = [
  { value: 35, color: "#f39c12", label: "Protein" },
  { value: 45, color: "#3498db", label: "Carbs" },
  { value: 20, color: "#e74c3c", label: "Fat" },
];

// Define interface for individual result items

export default function Index() {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [calories, setCalories] = useState(0);
  const [fat, setFat] = useState(0);

  const { foods, loading } = useFood();
  const safeFoods = Array.isArray(foods) ? foods : [];

  useEffect(() => {
    const totalProtein = safeFoods.reduce(
      (sum, food) => sum + (food.protein || 0),
      0
    );
    const totalCalories = safeFoods.reduce(
      (sum, food) => sum + (food.calories || 0),
      0
    );
    const totalCarbs = safeFoods.reduce(
      (sum, food) => sum + (food.carbs || 0),
      0
    );
    const totalFat = safeFoods.reduce((sum, food) => sum + (food.fat || 0), 0);

    setProtein(totalProtein);
    setCalories(totalCalories);
    setCarbs(totalCarbs);
    setFat(totalFat);
  }, [safeFoods]);

  return (
    //summary detailing information about protein, carbs, calorie intake for the day (consumed and remaining)
    <View style={styles.container}>
      <Text style={styles.title}>Summary</Text>
      <View style={styles.grid}>
        <View style={styles.column}>
          <Text style={styles.label}>Protein</Text>
          <Text style={styles.value}>{protein}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Calories</Text>
          <Text style={styles.value}>{calories}</Text>
        </View>
        <View style={styles.column}>
          {/* need to work on getting the carbs to return from the get request, need to adjust all the data interfaces,contexts, etc... */}
          <Text style={styles.label}>Carbs</Text>
          <Text style={styles.value}>{carbs}</Text>
        </View>

        <View style={styles.list}></View>
      </View>

      {/* meal plan goes here */}

      {/* energy expenditure weaving into overall calorie calculation goes here*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3, // Shadow (Android)
    shadowColor: "#000", // Shadow (iOS)
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2c3e50",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between", // Even spacing
  },
  column: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
  },
  list: {
    marginTop: 16,
  },
  item: {
    fontSize: 14,
    color: "#2c3e50",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  itemImage: {
    width: "100%",
    height: 200,
    borderRadius: 4,
  },
});
