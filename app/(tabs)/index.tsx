import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image } from "react-native";
import { useState, useEffect } from "react";
import MealPlanList from "@/components/MealPlanList";
import axios from "axios";
const data = [
  { value: 35, color: "#f39c12", label: "Protein" },
  { value: 45, color: "#3498db", label: "Carbs" },
  { value: 20, color: "#e74c3c", label: "Fat" },
];

// Define interface for individual result items
interface Result {
  id: number;
  name: string;
  image: string;
}

// Define interface for the entire API response
interface ApiResponse {
  results: Result[];
  offset: number;
  number: number;
  totalResults: number;
}

function MyComponent() {
  // Specify the generic type for useState
  const [apiData, setApiData] = useState<ApiResponse>({
    results: [],
    offset: 0,
    number: 0,
    totalResults: 0,
  });
}
export default function Index() {
  const [ingredients, setIngredients] = useState<ApiResponse>({
    results: [],
    offset: 0,
    number: 0,
    totalResults: 0,
  });

  useEffect(() => {
    // const fetchBanana = async () => {
    //   try {
    //     const response = await axios.get(
    //       "https://api.spoonacular.com/food/ingredients/9266/information?amount=1",
    //       {
    //         headers: {
    //           "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
    //         },
    //       }
    //     );
    //     console.log(response.data);
    //   } catch (error) {
    //     console.error("Error fetching data from spoonacular API", error);
    //   }
    // };
    // fetchBanana();
  }, []);

  //search ingredients function
  // `https://api.spoonacular.com/food/ingredients/search?query=${food}&${number}=2&sort=calories&sortDirection=desc`
  const ingredientName = "banana";
  const ingredientQuantity = "2";
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `https://api.spoonacular.com/food/ingredients/search?query=${ingredientName}&number=${ingredientQuantity}&sort=calories&sortDirection=desc`,
          {
            headers: {
              "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
            },
          }
        );
        setIngredients(response.data);
      } catch (error) {
        //handle error
        console.error("Error fetching data from spoonacular API", error);
      }
    };
    fetchIngredients();
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

        <View style={styles.list}></View>
      </View>

      {/* meal plan goes here */}
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>
          Total results: {ingredients.totalResults}
        </Text>

        <ScrollView>
          {ingredients.results?.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
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
    width: '100%',
    height: 200,
    borderRadius: 4,
  }
});
