import axios from "axios";
import {
  Recipe,
  Ingredient,
  NutritionInfo,
  IngredientSearchParams,
  RecipeSearchParams,
  FatSecretFood,
  FatSecretFoodDetails,
  FatSecretRecipeDetails,
  FatSecretSearchParams,
  MappedFatSecretRecipe,
} from "./interfaces";

const API_BASE_URL = "https://nutrition-app-backend-4795.onrender.com";

// testing for fatsecret endpoint integration
// const FATSECRET_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL, // or replace with your deployed server URL
});

export const foodApi = {
  // spoonacular endpoints
  searchIngredients: async ({
    query,
    limit = 3,
    sort = "calories",
    sortDirection = "desc",
  }: IngredientSearchParams): Promise<Ingredient[]> => {
    try {
      const response = await api.get("/api/ingredients", {
        params: { query, limit, sort, sortDirection },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      throw error;
    }
  },

  searchRecipes: async ({
    query,
    limit = 3,
    sort = "calories",
    sortDirection = "desc",
  }: RecipeSearchParams): Promise<Recipe[]> => {
    try {
      const response = await api.get("/api/recipes", {
        params: { query, limit, sort, sortDirection },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  },

  getNutrition: async (
    ingredientId: number,
    amount: number,
    unit: string
  ): Promise<NutritionInfo & { name: string }> => {
    const response = await api.get(
      `/api/ingredients/${ingredientId}/nutrition`,
      {
        params: { amount, unit },
      }
    );
    return response.data;
  },

  getRecipeInformation: async (recipeId: number) => {
    const response = await api.get(`/api/recipes/${recipeId}/information`);
    return response.data;
  },

  getRecipeNutrition: async (recipeId: number): Promise<NutritionInfo> => {
    const response = await api.get(`/api/recipes/${recipeId}/nutrition`);
    return response.data;
  },

  /* This section is for fatsecret endpoint integration*/
  getFatSecretFoods: async ({
    query,
    maxResults = 3,
    pageNumber = 0,
  }: FatSecretSearchParams): Promise<FatSecretFood[]> => {
    try {
      const response = await api.get("/api/fatsecret/search-foods", {
        params: {
          query,
          maxResults,
          pageNumber,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching FatSecret foods:", error);
      throw error;
    }
  },

  getFatSecretFoodById: async (
    foodId: string
  ): Promise<FatSecretFoodDetails> => {
    try {
      const response = await api.get(`/api/fatsecret/food/${foodId}`);

      return response.data;
    } catch (error) {
      console.error("Error fetching food details", error);
      throw error;
    }
  },

  getFatSecretRecipes: async ({
    query,
    maxResults = 3,
    pageNumber = 0,
  }: FatSecretSearchParams): Promise<MappedFatSecretRecipe[]> => {
    try {
      const response = await api.get("/api/fatsecret/recipes", {
        params: { query, maxResults, pageNumber },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching FatSecret recipes:", error);
      throw error;
    }
  },

  getFatSecretRecipeById: async (
    recipeId: string
  ): Promise<FatSecretRecipeDetails> => {
    try {
      const response = await api.get(`/api/fatsecret/recipe/${recipeId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching FatSecret recipe by ID:", error);
      throw error;
    }
  },
};

if (typeof window !== "undefined") {
  (window as any).foodApi = foodApi; // For debugging in browser
}
