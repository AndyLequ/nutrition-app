import axios from 'axios'

interface IngredientResponse {
    results: Array<{
        id: number;
        name: string;
        image: string;
        amount: number;
        unit: string;
    }>;
}

const api = axios.create({
    baseURL: 'https://api.spoonacular.com/food/ingredients',
    headers: {
        'x-api-key': process.env.EXPO_PUBLIC_API_KEY,
    },

})

export const fetchIngredients = async (ingredientName: string, ingredientQuantity: string) => {
    try {
        const response = await api.get<IngredientResponse>(`/search?query=${ingredientName}&number=${ingredientQuantity}&sort=calories&sortDirection=desc`)
        return response.data
    } catch (error) {
        console.error("Error fetching data from spoonacular API", error)
        throw error
    }
}

export const fetchIngredientInfo = async (ingredientId: number) => {
    try {
        const response = await api.get(`/information?amount=1&id=${ingredientId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching data from spoonacular API", error)
        throw error
    }
}

