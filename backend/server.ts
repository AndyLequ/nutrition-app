import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { Recipe,
    Ingredient,
    IngredientResponse,
    NutritionInfo,
    IngredientSearchParams,
    RecipeSearchParams } from './types';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

interface Nutrient {
    name: string;
    amount: number;
    unit: string;
}



const spoonacularApi = axios.create({
    baseURL: 'https://api.spoonacular.com',
    headers: {
        'x-api-key': process.env.EXPO_PUBLIC_API_KEY,
    },
})

// ingredient search endpoint
app.get('/api/ingredients/search', async (req, res) => {
  try {
    const { query, limit, sort, sortDirection } = req.query;

    if(!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    

    const response = await spoonacularApi.get('/food/ingredients/search', {
      params: { query, number: limit, sort, sortDirection }
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search ingredients' });
  }
});

// recipe search endpoint
app.get('/api/recipes/search', async (req, res) => {
    try {
        const { query, limit, sort, sortDirection } = req.query;
        const response = await spoonacularApi.get('/recipes/complexSearch', {
            params: { query, number: limit, sort, sortDirection }
        });
        res.json(response.data.results);

    } catch (error) {
        res.status(500).json({ error: 'Failed to search recipes' });
    }
})

// ingredient nutrition endpoint
app.get('/api/ingredients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const amount  = Number(req.query.amount) || 100;
        const unit = (req.query.unit as string) || 'g'

        const response = await spoonacularApi.get(`/food/ingredients/${id}/information`,
            {
                params: {
                    amount,
                    unit
                }
            }
        );
        
        const nutrients: Nutrient[] = response.data.nutrition.nutrients;

        const processedData = {
            name: response.data.name,
            protein: nutrients.find((nutrient) => nutrient.name === 'Protein')?.amount || 0,
            calories: nutrients.find((nutrient) => nutrient.name === 'Calories')?.amount || 0,
            carbs: nutrients.find((nutrient) => nutrient.name === 'Carbohydrates')?.amount || 0,
            fat: nutrients.find((nutrient) => nutrient.name === 'Fat')?.amount || 0,
            amount,
            unit,
        }
        
        res.json(processedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ingredient details' });
    }
})

// recipe information endpoint
app.get('/api/recipes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await spoonacularApi.get(`/recipes/${id}/information`);
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipe details' });
    }
})

// recipe nutrition endpoint
app.get('/api/recipes/:id/nutrition', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await spoonacularApi.get(`/recipes/${id}/nutritionWidget.json`);

        const processed = {
            protein: parseFloat(response.data.protein.replace(/[^\d.]/g, "")),
            calories: parseFloat(response.data.calories.replace(/[^\d.]/g, "")),
            carbs: parseFloat(response.data.carbs.replace(/[^\d.]/g, "")),
            fat: parseFloat(response.data.fat.replace(/[^\d.]/g, "")),
            amount: 1, // Default amount
            unit: "serving" // Default unit
        }

        res.json(processed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipe nutrition' });
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})