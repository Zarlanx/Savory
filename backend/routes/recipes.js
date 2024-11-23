const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

// GET all or searched recipes
router.get('/', async (req, res) => {
    const { q } = req.query; // Capture the search query
    try {
        const recipes = q
            ? await Recipe.find({ title: { $regex: q, $options: 'i' } }) // Case-insensitive search
            : await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});


// POST a new recipe
router.post('/', async (req, res) => {
    const { name, ingredients, instructions } = req.body;
    try {
        const newRecipe = new Recipe({ name, ingredients, instructions });
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

module.exports = router;
