// api.ts - Updated with better typing and nutrition endpoint
import axios from 'axios';

interface Ingredient {
    id: number;
    name: string;
    image: string;
}

interface IngredientResponse {
    results: Ingredient[];
}

interface NutritionInfo {
    protein: number;
    calories: number;
    carbs: number;
    fat: number;
    amount: number;
    unit: string;
}

const api = axios.create({
    baseURL: 'https://api.spoonacular.com',
    headers: {
        'x-api-key': process.env.EXPO_PUBLIC_API_KEY,
    },
});

export const foodApi = {
    searchIngredients: async (query: string, limit: number = 10): Promise<Ingredient[]> => {
        try {
            const response = await api.get<IngredientResponse>(
                `/food/ingredients/search?query=${query}&number=${limit}`
            );
            return response.data.results;
        } catch (error) {
            console.error("Error searching ingredients:", error);
            throw error;
        }
    },

    getNutrition: async (ingredientId: number, amount: number, unit: string): Promise<NutritionInfo & { name: string }> => {
        try {
            const response = await api.get<{
                name: string;
                nutrition: {
                    nutrients: Array<{ name: string; amount: number; unit: string }>
                }
            }>(`/food/ingredients/${ingredientId}/information`, {
                params: { amount, unit }
            });

            const nutrients = response.data.nutrition.nutrients;
            return {
                name: response.data.name,
                protein: nutrients.find(n => n.name === 'Protein')?.amount || 0,
                calories: nutrients.find(n => n.name === 'Calories')?.amount || 0,
                carbs: nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0,
                fat: nutrients.find(n => n.name === 'Fat')?.amount || 0,
                amount,
                unit
            };
        } catch (error) {
            console.error("Error fetching nutrition:", error);
            throw error;
        }
    }
};