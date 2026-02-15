// types.ts
export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export type FoodItem = {
  id: string;
  name: string;
  amount: string;
  mealType: MealType;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  createdAt: Date;
};

export type NutritionInfo = {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
};

export type UnifiedFoodItem = {
  id: number;
  name: string;
  type: "ingredient" | "recipe";
  amount?: string;
  protein?: number;
  calories?: number;
  carbs?: number;
  fat?: number;
};

export type UnifiedSearchResult = {
  id: number;
  name: string;
  type: "ingredient" | "recipe";
  source: "spoonacular" | "fatsecret";

  //optional enrichment
  baseAmount?: number;
  baseUnit?: string;
  servings?: number;

  nutrition?: NutritionInfo;
  fatSecretData?: FatSecretFoodDetails | FatSecretRecipeDetails;
};

export type MealPlan = {
  date: string;
  meals: {
    [key in MealType]: {
      items: FoodItem[];
      totalCalories: number;
      totalProtein: number;
    };
  };
  notes?: string;
};

interface Ingredient {
  id: number;
  name: string;
  image: string;
}

interface IngredientResponse {
  results: Ingredient[];
}

interface IngredientSearchParams {
  query: string;
  limit?: number;
  sort?: string;
  sortDirection?: "asc" | "desc";
}

interface RecipeSearchParams {
  query: string;
  limit?: number;
  sort?: string;
  sortDirection?: "asc" | "desc";
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  [key: string]: any;
}

//FatSecret API types
interface fatsecretNutritionInfo {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
  description: string;
}

interface FatSecretSearchResponse {
  foods: {
    food: FatSecretFood | FatSecretFood[];
    max_results: number;
    page_number: number;
    total_results: number;
  };
}

interface FatSecretFood {
  id: number;
  name: string;
}

interface MappedFatSecretRecipe {
  id: number;
  name: string;
  type: "recipe";
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    amount: number;
    unit: string;
  };
  categories: string[];
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
  };
  recipe_nutrition?: {
    protein: string;
    calories: string;
    carbohydrate: string;
    fat: string;
  };
  number_of_servings?: string;
}

interface FatSecretIngredient {
  food_id?: string;
  ingredient_name: string;
  ingredient_description: string;
}

export interface FatSecretFoodDetails {
  id: number;
  name: string;
  serving: fatsecretNutritionInfo;
  perGram: fatsecretNutritionInfo;
  servingSizeGrams?: number;
}

export interface FatSecretRecipeDetails {
  id: string;
  name: string;
  servingSizeGrams: number;
  nutritionPerServing: NutritionInfo;
  nutritionPerGram: NutritionInfo;
}
export {
  MappedFatSecretRecipe,
  Recipe,
  Ingredient,
  IngredientResponse,
  IngredientSearchParams,
  RecipeSearchParams,
  fatsecretNutritionInfo,
  FatSecretSearchResponse,
  FatSecretFood,
  FatSecretServing,
  FatSecretRecipe,
  FatSecretIngredient,
};
