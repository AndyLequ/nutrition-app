import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  Picker,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFood } from "../FoodProvider";

const addFood = () => {
  const [foodName, setfoodName] = useState("");
  const [Amount, setAmount] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snacks"
  >("breakfast");
  const { addFood } = useFood();

  useEffect(() => {
    const loadData = async () => {
      // Load data here
      try {
        const savedData = await AsyncStorage.getItem("data");
        if (savedData !== null) {
          const { savedfoodName, savedAmount, savedMealType } =
            JSON.parse(savedData);
          setfoodName(savedfoodName);
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

  useEffect(() => {
    if (!isLoading) {
      const saveData = async () => {
        try {
          const dataToSave = JSON.stringify({
            foodName,
            Amount,
            mealType,
          });
          await AsyncStorage.setItem("@inputs", dataToSave);
        } catch (e) {
          console.error("Failed to save data");
        }
      };
      saveData();
    }
  }, [foodName, Amount, mealType, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!foodName || !Amount) {
      return;
    }

    await addFood({ name: foodName, amount: Amount, mealType });
    setfoodName("");
    setAmount("");
    setMealType("breakfast");
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>Add Food</Text>

        <View style={styles.rowContainer}>
          <View style={[styles.inputGroup, styles.flexContainer]}>
            <Text style={styles.label}>Food Name</Text>
            <TextInput
              style={[styles.input, isFocused1 && styles.inputFocused]}
              placeholder="Enter text..."
              placeholderTextColor="#94a3b8"
              value={foodName}
              onChangeText={setfoodName}
              onFocus={() => setIsFocused1(true)}
              onBlur={() => setIsFocused1(false)}
            />
          </View>

          <View style={[styles.inputGroup, styles.flexContainer]}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={[styles.input, isFocused2 && styles.inputFocused]}
              placeholder="Type here..."
              placeholderTextColor="#94a3b8"
              value={Amount}
              onChangeText={setAmount}
              onFocus={() => setIsFocused2(true)}
              onBlur={() => setIsFocused2(false)}
            />
          </View>

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

          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={handleSubmit} />
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
});

export default addFood;
