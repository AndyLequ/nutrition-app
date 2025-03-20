import axios from 'axios'

//interface for ingredient response
interface IngredientResponse {
    results: Array<{
        id: number;
        name: string;
        image: string;
        amount: number;
        unit: string;
    }>;
}

// Create an axios instance with default settings
const api = axios.create({
    baseURL: 'https://api.spoonacular.com/food/ingredients',
    headers: {
        'x-api-key': process.env.EXPO_PUBLIC_API_KEY,
    },

})

// function for fetching list of ingredients based on the search query
export const fetchIngredients = async (ingredientName: string, ingredientQuantity: string) => {
    try {
        const response = await api.get<IngredientResponse>(`/search?query=${ingredientName}&number=${ingredientQuantity}&sort=calories&sortDirection=desc`)
        return response.data
    } catch (error) {
        console.error("Error fetching data from spoonacular API", error)
        throw error
    }
}

// function for fetching ingredient information based on the ingredient id
export const fetchIngredientInfo = async (ingredientId: number) => {
    try {
        const response = await api.get(`/information?amount=1&id=${ingredientId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching data from spoonacular API", error)
        throw error
    }
}

