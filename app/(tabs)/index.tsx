import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import Svg, { Path, G } from "react-native-svg";
import MealPlanList from "@/components/MealPlanList";
import axios from "axios";
import { CALORIENINJAS_API_KEY} from '@env'
const apiKey = CALORIENINJAS_API_KEY
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
    //         api_key: apiKey
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
            "X-API-Key": `${apiKey}`,
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
      <View style={styles.summaryGrid}>
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

        <View style={styles.foodList}>
          {foods && foods.items?.length > 0 && (
            <View style={styles.listContainer}>
              <View style={styles.listItem}>
                <Text style={styles.listLabel}>Name:</Text>
                <Text style={styles.listValue}>{foods.items[0].name}</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listLabel}>Calories:</Text>
                <Text style={styles.listValue}>{foods.items[0].calories}</Text>
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
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  column: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    width: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 15,
    color: "#636e72",
    marginBottom: 6,
    fontWeight: "500",
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    letterSpacing: 0.25,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 25,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  summaryCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 18,
    width: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
  },
  foodList: {
    marginTop: 15,
  },
  listContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  listLabel: {
    fontSize: 16,
    color: "#636e72",
    fontWeight: "500",
  },
  listValue: {
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "600",
  },
});
