import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

type FoodItem = {
  id: string;
  name: string;
  amount: string; // Add the amount property
  mealType: MealType;
  createdAt: Date;
};

interface FoodContextType {
  foods: FoodItem[];
  addFood: (food: Omit<FoodItem, "id" | "createdAt">) => Promise<void>;
  loading: boolean;
  query: string;
  setQuery: () => void;
}

const FoodContext = createContext<FoodContextType>({
  query: "",
  setQuery: () => {},
  foods: [],
  addFood: async () => {},
  loading: true,
});

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved foods on mount
  useEffect(() => {
    const loadFoods = async () => {
      try {
        const savedFoods = await AsyncStorage.getItem("@foods");
        if (savedFoods) {
          setFoods(
            JSON.parse(savedFoods, (key, value) => {
              if (key === "createdAt") return new Date(value);
              return value;
            })
          );
        }
      } catch (error) {
        console.error("Error loading foods:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  // Save foods whenever they change
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem("@foods", JSON.stringify(foods));
    }
  }, [foods]);

  const addFood = async (food: Omit<FoodItem, "id" | "createdAt">) => {
    const newFood: FoodItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...food,
      createdAt: new Date(),
    };

    setFoods((prev) => [...prev, newFood]);
  };

  return (
    <FoodContext.Provider value={{ foods, addFood, loading }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => useContext(FoodContext);
