const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: String,
    servings: Number,
    readyInMinutes: Number,
    sourceUrl: String,
    ingredients: [String], // Array of ingredient names
    instructions: String,  // Recipe instructions
    dishTypes: [String],   // E.g., "main course", "dessert"
    healthScore: Number,
    pricePerServing: Number,
    vegetarian: Boolean,
    vegan: Boolean,
});

module.exports = mongoose.model('Recipe', recipeSchema);
