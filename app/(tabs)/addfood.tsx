import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  Picker,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFood } from "../FoodProvider";
import debounce from "lodash.debounce";
import axios from "axios";


// function to add food, whatever is submitted will be displayed in another file, probably the logger
const addFood = () => {

  //the state variables, these states are concerned with the food being searched and then added
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snacks"
  >("breakfast");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const [submittedFoods, setSubmittedFoods] = useState([]);
  const [showFoodList, setShowFoodList] = useState(false);

  const { addFood } = useFood();

  // function for searching for food, will be called when the user types in the search bar
  // this function will be debounced to avoid making too many requests to the API
  const debouncedSearch = debounce(async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/food/ingredients/search?query=${query}&number=2&sort=calories&sortDirection=desc`,
          {
            headers: {
              "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
            },
          }
        );
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error("Error fetching data from spoonacular API", error);
      } finally {
        setIsSearching(false);
      }
    }
  });

  // function to handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
    } else debouncedSearch(query);
  };

  // function to handle food selection
  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setSearchQuery(food.description);
    setSearchResults([]);
  };
  
  // function to handle form submission
  // this function will be called when the user clicks the submit button
  const handleSubmit = async () => {
    if (!searchQuery || !amount) {
      return;
    }
    
    await addFood({ name: searchQuery, amount: amount, mealType });
    setSearchQuery("");
    setAmount("");
    setMealType("breakfast");
    setSelectedFood(null);
  };
  
  // useEffect to load data from async storage
  useEffect(() => {
    const loadData = async () => {
      // Load data here
      try {
        const savedData = await AsyncStorage.getItem("data");
        if (savedData !== null) {
          const { savedfoodName, savedAmount, savedMealType } =
            JSON.parse(savedData);
          setSearchQuery(savedfoodName);
          setAmount(savedAmount);
          setMealType(savedMealType || "breakfast");
        }
      } catch (e) {
        console.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // useEffect to save data to async storage
  useEffect(() => {
    if (!isLoading) {
      const saveData = async () => {
        try {
          const dataToSave = JSON.stringify({
            searchQuery,
            amount,
            mealType,
          });
          await AsyncStorage.setItem("@inputs", dataToSave);
        } catch (e) {
          console.error("Failed to save data");
        }
      };
      saveData();
    }
  }, [searchQuery, amount, mealType, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  // return the form to add food
  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>Add Food</Text>

        <View style={styles.rowContainer}>
          <View style={[styles.inputGroup, styles.flexContainer]}>
            <Text style={styles.label}>Search Food</Text>
            <TextInput
              style={[styles.input, isFocused1 && styles.inputFocused]}
              placeholder="Search for food..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsFocused1(true)}
              onBlur={() => setIsFocused1(false)}
            />
          </View>

          {/* below is the search indicator showing the searching status */}
          {isSearching && <ActivityIndicator style={styles.searchIndicator} />}

          {/* below is the list of potential items */}
          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => {
                    setSelectedFood(item);
                    setSearchQuery(item.description);
                    setSearchResults([]);
                  }}
                ></TouchableOpacity>
              )}
            />
          )}

          {/* below is the amount input field */}
          <View style={[styles.inputGroup, styles.flexContainer]}>
            <Text style={styles.label}>amount</Text>
            <TextInput
              style={[styles.input, isFocused2 && styles.inputFocused]}
              placeholder="Enter amount (e.g., 100g)"
              placeholderTextColor="#94a3b8"
              value={amount}
              onChangeText={setAmount}
              onFocus={() => setIsFocused2(true)}
              onBlur={() => setIsFocused2(false)}
            />
          </View>

          {/* below is the meal type picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Type</Text>
            <Picker
              selectedValue={mealType}
              onValueChange={(itemValue) => setMealType(itemValue)}
            >
              <Picker.Item label="Breakfast" value="breakfast" />
              <Picker.Item label="Lunch" value="lunch" />
              <Picker.Item label="Dinner" value="dinner" />
              <Picker.Item label="Snacks" value="snacks" />
            </Picker>
          </View>

          {/* below is the submit button */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText} onPress={handleSubmit}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  inputFocused: {
    borderColor: "#6366f1",
    borderWidth: 2,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    height: 40,
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#6366f1",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  button: {
    height: 30,
    backgroundColor: "#6366f1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    margin: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default addFood;
