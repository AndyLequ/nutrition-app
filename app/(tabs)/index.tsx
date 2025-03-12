import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import Svg, { Path, G } from "react-native-svg";
import MealPlanList from "@/components/MealPlanList";
import axios from "axios";

const data = [
  { value: 35, color: "#f39c12", label: "Protein" },
  { value: 45, color: "#3498db", label: "Carbs" },
  { value: 20, color: "#e74c3c", label: "Fat" },
];

// const calculatePieSections = (data, size) => {
//   const total = data.reduce((sum, item) => sum + item.value, 0);
//   let startAngle = 0;

//   return data.map((item, index) => {
//     const angle = (item.value / total) * Math.PI * 2;
//     const endAngle = startAngle + angle;

//   })
// }

export default function Index() {
  interface FoodData {
    items: { name: string; calories: number }[];
  }

  const [foods, setFoods] = useState<FoodData | null>(null);

  const query = "10oz chicken";

  useEffect(() => {
    fetchFoodData();
  }, []);

  const fetchFoodData = async () => {
    // try {
    //   const response = await axios.get(
    //     "https://api.calorieninjas.com/v1/nutrition?query=" + query,
    //     {
    //       params: {
    //         api_key: "+cluK2htPjTdPiQkB8UWGQ==EvpntLCBKYrr2A65",
    //       },
    //     }
    //   );
    //   setFoods(response.data);
    // } catch (error) {
    //   console.log(error);
    // }
    try {
      const response = await fetch(
        "https://api.calorieninjas.com/v1/nutrition?query=" + query,
        {
          headers: {
            "X-API-Key": "+cluK2htPjTdPiQkB8UWGQ==EvpntLCBKYrr2A65",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const jsonData = await response.json();
      setFoods(jsonData); // Update state with fetched data
    } catch (err) {
      console.log(err); // Handle errors
    }
  };

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
          {foods && foods.items?.length > 0 && (
            <View style={styles.listContainer}>
              <View style={styles.listItem}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{foods.items[0].name}</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.label}>Calories: </Text>
                <Text style={styles.value}>{foods.items[0].calories}</Text>
              </View>
            </View>
          )}
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
  listContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "baseline",
  },
});
