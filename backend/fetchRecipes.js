require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

const fetchAndSaveRecipes = async () => {
    console.log('Mongo URI:', process.env.MONGO_URI);

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');

        console.log('Fetching recipes from Spoonacular API...');
        const response = await axios.get('https://api.spoonacular.com/recipes/random', {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                number: 10,
                limitLicense: true,
            },
        });

        const recipes = response.data.recipes;
        console.log(`Fetched ${recipes.length} recipes from the API.`);

        // Loop through recipes and save them to the database
        for (const recipe of recipes) {
            console.log(`Processing recipe: ${recipe.title}`);

            const ingredients = recipe.extendedIngredients.map((ing) => ing.original);

            const newRecipe = new Recipe({
                title: recipe.title,
                image: recipe.image,
                servings: recipe.servings,
                readyInMinutes: recipe.readyInMinutes,
                sourceUrl: recipe.sourceUrl,
                ingredients,
                instructions: recipe.instructions || 'No instructions available.',
                dishTypes: recipe.dishTypes || [],
                healthScore: recipe.healthScore || 0,
                pricePerServing: recipe.pricePerServing || 0,
                vegetarian: recipe.vegetarian,
                vegan: recipe.vegan,
            });

            await newRecipe.save();
            console.log(`Saved recipe: ${recipe.title}`);
        }

        console.log('All recipes have been saved successfully!');
        mongoose.connection.close(); // Close the MongoDB connection after completion
    } catch (error) {
        console.error('Error fetching recipes:', error.message || error);
    }
};

// Call the function
fetchAndSaveRecipes();
