import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import MealPlanList from "@/components/MealPlanList";
import axios from "axios";
const data = [
  { value: 35, color: "#f39c12", label: "Protein" },
  { value: 45, color: "#3498db", label: "Carbs" },
  { value: 20, color: "#e74c3c", label: "Fat" },
];
console.log("API Key:", process.env.REACT_APP_API_KEY);
export default function Index() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          "https://api.spoonacular.com/food/ingredients/9266/information?amount=1",
          {
            headers: {
              "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data from spoonacular API", error);
      }
    };

    fetchFoods();
  }, []);

  return (
    //summary detailing information about protein, carbs, calorie intake for the day (consumed and remaining)
    <View style={styles.container}>
      <Text style={styles.title}>Summary</Text>
      <View style={styles.grid}>
        <View style={styles.column}>
          <Text style={styles.label}>Protein</Text>
          <Text style={styles.value}>0g</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Calories</Text>
          <Text style={styles.value}>0</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Carbs</Text>
          <Text style={styles.value}>0g</Text>
        </View>

        <View style={styles.list}>
          {foods.map((food) => (
            <Text key={food} style={styles.item}>
              {food}
            </Text>
          ))}
        </View>
      </View>

      {/* meal plan goes here */}
      {/* foods eaten goes here */}
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
});
