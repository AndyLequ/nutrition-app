import axios from 'axios';

interface Recipe {
  id: number;
  title: string;
  image: string;
  [key: string]: any;
}

interface Ingredient {
  id: number;
  name: string;
  image: string;
}

interface NutritionInfo {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
}

interface IngredientSearchParams {
  query: string;
  limit?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

interface RecipeSearchParams {
  query: string;
  limit?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

//FatSecret API types
interface FatSecretFood {
  id: number;
  name: string;
}

interface FatSecretFoodDetails {
  id: string;
  name: string;
  type: string;
  url: string;
  brand: string;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
}

interface FatSecretServing {
  protein: string;
  calories: string;
  carbohydrate: string;
  fat: string;
  metric_serving_amount: string;
  metric_serving_unit: string;
}

interface FatSecretRecipe {
  recipe_id: string;
  recipe_name: string;
  recipe_image?: string;
  recipe_url?: string;
  recipe_description?: string;
  ingredients?: {
    ingredient: FatSecretIngredient | FatSecretIngredient[];
  }
  recipe_nutrition?: {
    protein: string;
    calories: string;
    carbohydrate: string;
    fat: string;
  }
  number_of_servings?: string;
}


interface FatSecretIngredient {
  food_id?: string;
  ingredient_name: string;
  ingredient_description: string;
}

interface FatSecretSearchParams {
  query: string;
  maxResults?: number;
  pageNumber?: number;
}


const API_BASE_URL = 'https://nutrition-app-backend-4795.onrender.com'

// testing for fatsecret endpoint integration
const FATSECRET_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL, // or replace with your deployed server URL
});

const fatsecretApi = axios.create({
  baseURL: FATSECRET_BASE_URL, // or replace with your deployed server URL
});

export const foodApi = {
  searchIngredients: async ({
    query,
    limit = 3,
    sort = 'calories',
    sortDirection = 'desc'
  }: IngredientSearchParams): Promise<Ingredient[]> => {
    const response = await api.get('/api/ingredients', {
      params: { query, limit, sort, sortDirection }
    });
    return response.data;
  },

  searchRecipes: async ({
    query,
    limit = 3,
    sort = 'calories',
    sortDirection = 'desc'
  }: RecipeSearchParams): Promise<Recipe[]> => {
    const response = await api.get('/api/recipes', {
      params: { query, limit, sort, sortDirection }
    });
    return response.data;
  },

  getNutrition: async (
    ingredientId: number,
    amount: number,
    unit: string
  ): Promise<NutritionInfo & { name: string }> => {
    const response = await api.get(`/api/ingredients/${ingredientId}/nutrition`, {
      params: { amount, unit }
    });
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
  getFatSecretFoods: async({
    query,
    maxResults = 2,
    pageNumber = 0
  }: FatSecretSearchParams): Promise<FatSecretFood[]> => {
    
    try {
      const response = await fatsecretApi.get('/api/fatsecret/search-foods', {
        params: {
          query,
          maxResults,
          pageNumber
        }
      });

      return response.data
    } catch (error) {
      console.error('Error fetching FatSecret foods:', error);
      throw error;
    }
  },

  getFatSecretFoodById: async (foodId: string): Promise<FatSecretFoodDetails> => {
    try {
      
      const response = await fatsecretApi.get(`/api/fatsecret/food/${foodId}`);
    
      return response.data
    } catch (error) {
      console.error('Error fetching food details', error)
      throw error;
    }
  }



};

if(typeof window !== 'undefined') {
(window as any).foodApi = foodApi; // For debugging in browser
}
