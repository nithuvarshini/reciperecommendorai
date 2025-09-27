// Recipe Recommendation Agentic AI System
class RecipeAI {
    constructor() {
        this.recipes = [];
        this.selectedIngredients = new Set();
        this.savedRecipes = new Set();
        this.ingredientCategories = {
            vegetables: ['tomato', 'onion', 'potato', 'carrot', 'bell pepper', 'spinach', 'cauliflower', 'broccoli', 'cucumber', 'garlic', 'ginger'],
            spices: ['turmeric', 'cumin', 'coriander', 'garam masala', 'red chili', 'black pepper', 'cardamom', 'cinnamon', 'cloves', 'bay leaves'],
            grains: ['rice', 'wheat flour', 'quinoa', 'oats', 'barley', 'millet', 'semolina', 'corn', 'buckwheat'],
            dairy: ['milk', 'yogurt', 'cheese', 'butter', 'cream', 'paneer', 'ghee'],
            proteins: ['chicken', 'fish', 'eggs', 'lentils', 'chickpeas', 'kidney beans', 'tofu', 'mutton', 'prawns']
        };
        // Load user recipes from localStorage (persistent across refreshes)
        this.userRecipes = JSON.parse(localStorage.getItem('userRecipes')) || [];
        this.init();
    }

    init() {
        this.loadRecipes();
        this.loadSavedRecipes();
        this.setupEventListeners();
        this.renderIngredientCategories();
        this.updateSavedRecipesList();
    }

    // Load sample recipe dataset
    loadRecipes() {
        this.recipes = [
            {
                id: 1,
                name: "Butter Chicken",
                cuisine: "indian",
                diet: "non-vegetarian",
                cookingTime: 45,
                ingredients: ["chicken", "butter", "tomato", "onion", "garlic", "ginger", "cream", "garam masala", "turmeric", "red chili"],
                instructions: ["Marinate chicken with spices", "Cook onion and tomato base", "Add chicken and simmer", "Finish with cream and butter"],
                description: "Rich and creamy North Indian chicken curry"
            },
            {
                id: 2,
                name: "Vegetable Biryani",
                cuisine: "indian",
                diet: "vegetarian",
                cookingTime: 60,
                ingredients: ["rice", "potato", "carrot", "bell pepper", "onion", "yogurt", "garam masala", "turmeric", "cumin", "bay leaves"],
                instructions: ["Soak rice", "Prepare vegetables", "Layer rice and vegetables", "Cook on dum"],
                description: "Aromatic rice dish with mixed vegetables"
            },
            {
                id: 3,
                name: "Spaghetti Carbonara",
                cuisine: "italian",
                diet: "non-vegetarian",
                cookingTime: 20,
                ingredients: ["spaghetti", "eggs", "cheese", "bacon", "black pepper", "garlic"],
                instructions: ["Cook pasta", "Prepare egg mixture", "Combine with hot pasta", "Add cheese and pepper"],
                description: "Classic Italian pasta with creamy egg sauce"
            },
            {
                id: 4,
                name: "Dal Tadka",
                cuisine: "indian",
                diet: "vegetarian",
                cookingTime: 30,
                ingredients: ["lentils", "onion", "tomato", "garlic", "ginger", "turmeric", "cumin", "coriander", "ghee"],
                instructions: ["Cook lentils", "Prepare tadka", "Mix and simmer", "Garnish with coriander"],
                description: "Spiced lentil curry with tempering"
            },
            {
                id: 5,
                name: "Chicken Fried Rice",
                cuisine: "chinese",
                diet: "non-vegetarian",
                cookingTime: 25,
                ingredients: ["rice", "chicken", "eggs", "carrot", "bell pepper", "onion", "garlic", "soy sauce"],
                instructions: ["Cook rice", "Stir fry chicken", "Add vegetables", "Mix with rice and seasonings"],
                description: "Quick and flavorful Chinese-style fried rice"
            },
            {
                id: 6,
                name: "Paneer Butter Masala",
                cuisine: "indian",
                diet: "vegetarian",
                cookingTime: 35,
                ingredients: ["paneer", "butter", "tomato", "onion", "cream", "garam masala", "turmeric", "red chili", "garlic", "ginger"],
                instructions: ["Prepare tomato base", "Add spices", "Add paneer cubes", "Finish with cream"],
                description: "Creamy cottage cheese curry"
            },
            {
                id: 7,
                name: "Margherita Pizza",
                cuisine: "italian",
                diet: "vegetarian",
                cookingTime: 30,
                ingredients: ["wheat flour", "tomato", "cheese", "basil", "olive oil", "garlic"],
                instructions: ["Prepare dough", "Make sauce", "Add toppings", "Bake until golden"],
                description: "Classic Italian pizza with fresh basil"
            },
            {
                id: 8,
                name: "Rajma Curry",
                cuisine: "indian",
                diet: "vegetarian",
                cookingTime: 45,
                ingredients: ["kidney beans", "onion", "tomato", "garlic", "ginger", "cumin", "coriander", "garam masala", "turmeric"],
                instructions: ["Soak and cook beans", "Prepare onion-tomato base", "Add spices", "Simmer until thick"],
                description: "Spicy kidney bean curry"
            },
            {
                id: 9,
                name: "Vegetable Stir Fry",
                cuisine: "chinese",
                diet: "vegetarian",
                cookingTime: 15,
                ingredients: ["broccoli", "carrot", "bell pepper", "onion", "garlic", "ginger", "soy sauce"],
                instructions: ["Heat oil", "Add garlic and ginger", "Stir fry vegetables", "Season and serve"],
                description: "Quick and healthy vegetable stir fry"
            },
            {
                id: 10,
                name: "Masala Dosa",
                cuisine: "indian",
                diet: "vegetarian",
                cookingTime: 40,
                ingredients: ["rice", "lentils", "potato", "onion", "turmeric", "cumin", "mustard seeds", "curry leaves"],
                instructions: ["Prepare batter", "Make potato filling", "Cook dosa", "Serve with chutney"],
                description: "South Indian crepe with spiced potato filling"
            }
        ];
        // Merge user-added recipes
        this.recipes = [...this.recipes, ...this.userRecipes];
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('ingredientInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        // Add Ingredient button
        document.getElementById('addIngredientBtn').addEventListener('click', () => {
            const input = document.getElementById('ingredientInput').value.trim();
            if (input.length === 0) return;
            const ingredients = this.parseIngredients(input);
            ingredients.forEach(ing => this.selectedIngredients.add(ing));
            document.getElementById('ingredientInput').value = ''; // clear input
            this.updateSelectedIngredients();
            this.renderIngredientGrid(document.querySelector('.tab-btn.active').dataset.category);
            this.performSearch();
        });
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetPage();
        });

        // Category tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderIngredientGrid(e.target.dataset.category);
            });
        });

        // Filters
        ['cuisineFilter', 'dietFilter', 'timeFilter'].forEach(filterId => {
            document.getElementById(filterId).addEventListener('change', () => this.performSearch());
        });

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('recipeModal').style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('recipeModal')) {
                document.getElementById('recipeModal').style.display = 'none';
            }
        });
        // Handle add recipe form submission
        const addRecipeForm = document.getElementById('addRecipeForm');
        if (addRecipeForm) {
            addRecipeForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const newRecipe = {
                    id: Date.now(), // unique id
                    name: document.getElementById('recipeName').value.trim(),
                    cuisine: document.getElementById('recipeCuisine').value || "general",
                    diet: document.getElementById('recipeDiet').value || "all",
                    cookingTime: document.getElementById('recipeTime').value ? parseInt(document.getElementById('recipeTime').value) : 30,
                    ingredients: document.getElementById('recipeIngredients').value
                        .toLowerCase()
                        .split(',')
                        .map(i => i.trim()),
                    instructions: document.getElementById('recipeInstructions').value.trim().split('\n'),
                    description: "User added recipe"
                };

                // Save in memory + localStorage
                this.userRecipes.push(newRecipe);
                localStorage.setItem('userRecipes', JSON.stringify(this.userRecipes));

                // Also push into active recipes
                this.recipes.push(newRecipe);

                // Reset the form
                addRecipeForm.reset();

                alert("✅ Recipe added successfully!");
            });
        }
    }
    // Reset everything
    resetPage() {
        this.selectedIngredients.clear();
        document.getElementById('ingredientInput').value = '';
        document.getElementById('cuisineFilter').value = '';
        document.getElementById('dietFilter').value = '';
        document.getElementById('timeFilter').value = '';
        this.updateSelectedIngredients();
        this.renderIngredientGrid(document.querySelector('.tab-btn.active').dataset.category);
        this.showWelcomeMessage();
    }

    // Render ingredient categories
    renderIngredientCategories() {
        this.renderIngredientGrid('vegetables');
    }

    renderIngredientGrid(category) {
        const grid = document.getElementById('ingredientGrid');
        const ingredients = this.ingredientCategories[category] || [];
        
        grid.innerHTML = ingredients.map(ingredient => `
            <div class="ingredient-item ${this.selectedIngredients.has(ingredient) ? 'selected' : ''}" 
                 data-ingredient="${ingredient}">
                ${this.capitalizeFirst(ingredient)}
            </div>
        `).join('');

        // Add click listeners
        grid.querySelectorAll('.ingredient-item').forEach(item => {
            item.addEventListener('click', () => this.toggleIngredient(item.dataset.ingredient));
        });
    }

    // Toggle ingredient selection
    toggleIngredient(ingredient) {
        const normalized = this.normalizeIngredient(ingredient);
        
        if (this.selectedIngredients.has(normalized)) {
            this.selectedIngredients.delete(normalized);
        } else {
            this.selectedIngredients.add(normalized);
        }
        
        this.updateSelectedIngredients();
        this.renderIngredientGrid(document.querySelector('.tab-btn.active').dataset.category);
        
        if (this.selectedIngredients.size > 0) {
            this.performSearch();
        }
    }

    // Update selected ingredients display
    updateSelectedIngredients() {
        const container = document.getElementById('selectedIngredients');
        const tagsContainer = document.getElementById('ingredientTags');
        
        if (this.selectedIngredients.size === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        tagsContainer.innerHTML = Array.from(this.selectedIngredients).map(ingredient => `
            <div class="ingredient-tag">
                ${this.capitalizeFirst(ingredient)}
                <span class="remove" data-ingredient="${ingredient}">&times;</span>
            </div>
        `).join('');

        // Add remove listeners
        tagsContainer.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedIngredients.delete(btn.dataset.ingredient);
                this.updateSelectedIngredients();
                this.renderIngredientGrid(document.querySelector('.tab-btn.active').dataset.category);
                this.performSearch();
            });
        });
    }

    // Normalize ingredient input (handle case, plurals, etc.)
    normalizeIngredient(ingredient) {
        let normalized = ingredient.toLowerCase().trim();
        
        // Handle common plurals
        const pluralMap = {
            'tomatoes': 'tomato',
            'onions': 'onion',
            'potatoes': 'potato',
            'carrots': 'carrot',
            'peppers': 'bell pepper',
            'eggs': 'egg',
            'beans': 'kidney beans',
            'lentils': 'lentil'
        };
        
        return pluralMap[normalized] || normalized;
    }

    // Parse input ingredients
    parseIngredients(input) {
        return input.split(/[,\s]+/)
            .filter(item => item.length > 0)
            .map(item => this.normalizeIngredient(item));
    }

    // Perform search with AI reasoning
    async performSearch() {
        const input = document.getElementById('ingredientInput').value.trim();
        const inputIngredients = input ? this.parseIngredients(input) : [];
        
        // Combine input and selected ingredients
        const allIngredients = new Set([...inputIngredients, ...this.selectedIngredients]);
        
        if (allIngredients.size === 0) {
            this.showWelcomeMessage();
            return;
        }

        // Show AI reasoning
        this.showAIReasoning(Array.from(allIngredients));
        
        // Show loading
        this.showLoading();
        
        // Simulate AI processing delay
        //await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get recommendations
        const recommendations = this.getRecommendations(Array.from(allIngredients));
        
        // Display results
        this.displayResults(recommendations, Array.from(allIngredients));
    }

    // Show AI reasoning steps
    showAIReasoning(ingredients) {
        const reasoningContainer = document.getElementById('aiReasoning');
        const stepsContainer = document.getElementById('reasoningSteps');
        
        const steps = [
            `Normalizing input ingredients: ${ingredients.map(i => this.capitalizeFirst(i)).join(', ')}`,
            `Identifying ingredient categories: ${this.categorizeIngredients(ingredients)}`,
            `Searching recipe database for matches...`,
            `Scoring recipes based on ingredient overlap and relevance`,
            `Ranking results by match score and applying filters`
        ];
        
        stepsContainer.innerHTML = steps.map((step, index) => `
            <div class="reasoning-step">
                <span class="step-number">Step ${index + 1}:</span> ${step}
            </div>
        `).join('');
        
        reasoningContainer.style.display = 'block';
    }

    // Categorize ingredients for reasoning
    categorizeIngredients(ingredients) {
        const categories = new Set();
        
        ingredients.forEach(ingredient => {
            Object.entries(this.ingredientCategories).forEach(([category, items]) => {
                if (items.includes(ingredient)) {
                    categories.add(category);
                }
            });
        });
        
        return Array.from(categories).join(', ') || 'mixed ingredients';
    }

    // Generate reasoning for each recipe
    generateReasoning(recipe, matchedIngredients, userIngredients) {
        const matchCount = matchedIngredients.length;
        const totalIngredients = recipe.ingredients.length;
        const percentage = Math.round((matchCount / totalIngredients) * 100);
        
        let reasoning = `This recipe matches ${matchCount} out of ${totalIngredients} ingredients (${percentage}% match). `;
        
        if (matchCount === totalIngredients) {
            reasoning += "Perfect match! You have all required ingredients.";
        } else if (percentage >= 70) {
            reasoning += "Excellent match! You're missing only a few ingredients.";
        } else if (percentage >= 50) {
            reasoning += "Good match! Consider getting the missing ingredients.";
        } else {
            reasoning += "Partial match. This recipe uses some of your ingredients creatively.";
        }
        
        const missingIngredients = recipe.ingredients.filter(ingredient => 
            !matchedIngredients.includes(ingredient)
        );
        
        if (missingIngredients.length > 0 && missingIngredients.length <= 3) {
            reasoning += ` Missing: ${missingIngredients.join(', ')}.`;
        }
        
        return reasoning;
    }

    // Display search results
    displayResults(recommendations, searchIngredients) {
        const resultsContainer = document.getElementById('recipeResults');
        
        if (recommendations.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No recipes found</h3>
                    <p>Try different ingredients or adjust your filters.</p>
                    <div class="suggestions">
                        <h4>Suggestions:</h4>
                        <p>• Add common ingredients like onion, garlic, or tomato</p>
                        <p>• Try broader ingredient categories</p>
                        <p>• Remove some filters to see more options</p>
                    </div>
                </div>
            `;
            return;
        }
        
        resultsContainer.innerHTML = recommendations.map(recipe => this.createRecipeCard(recipe, searchIngredients)).join('');
        
        // Add event listeners to recipe cards
        this.addRecipeCardListeners();
    }

    // Create recipe card HTML
    createRecipeCard(recipe, searchIngredients) {
        const isSaved = this.savedRecipes.has(recipe.id);
        
        return `
            <div class="recipe-card" data-recipe-id="${recipe.id}">
                <div class="recipe-image">
                    <i class="fas fa-utensils"></i>
                </div>
                <div class="recipe-content">
                    <div class="recipe-header">
                        <h3 class="recipe-title">${recipe.name}</h3>
                        <div class="match-score">${recipe.percentage}% match</div>
                    </div>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.cookingTime} min</span>
                        <span><i class="fas fa-tag"></i> ${this.capitalizeFirst(recipe.cuisine)}</span>
                        <span><i class="fas fa-leaf"></i> ${this.capitalizeFirst(recipe.diet)}</span>
                    </div>
                    <div class="recipe-ingredients">
                        <h4>Ingredients:</h4>
                        <div class="ingredient-list">
                            ${recipe.ingredients.map(ingredient => `
                                <span class="ingredient-chip ${recipe.matchedIngredients.includes(ingredient) ? 'matched' : ''}">
                                    ${this.capitalizeFirst(ingredient)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="recipe-reasoning">
                        <i class="fas fa-lightbulb"></i> ${recipe.reasoning}
                    </div>
                    <div class="recipe-actions">
                        <button class="save-btn ${isSaved ? 'saved' : ''}" data-recipe-id="${recipe.id}">
                            <i class="fas fa-heart"></i> ${isSaved ? 'Saved' : 'Save'}
                        </button>
                        <button class="view-btn" data-recipe-id="${recipe.id}">
                            <i class="fas fa-eye"></i> View Recipe
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Add event listeners to recipe cards
    addRecipeCardListeners() {
        // Save/unsave recipe buttons
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeId = parseInt(btn.dataset.recipeId);
                this.toggleSaveRecipe(recipeId);
            });
        });
        
        // View recipe buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeId = parseInt(btn.dataset.recipeId);
                this.showRecipeModal(recipeId);
            });
        });
        
        // Recipe card click
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', () => {
                const recipeId = parseInt(card.dataset.recipeId);
                this.showRecipeModal(recipeId);
            });
        });
    }

    // Toggle save recipe
    toggleSaveRecipe(recipeId) {
        const btn = document.querySelector(`.save-btn[data-recipe-id="${recipeId}"]`);
        
        if (this.savedRecipes.has(recipeId)) {
            this.savedRecipes.delete(recipeId);
            btn.classList.remove('saved');
            btn.innerHTML = '<i class="fas fa-heart"></i> Save';
        } else {
            this.savedRecipes.add(recipeId);
            btn.classList.add('saved');
            btn.innerHTML = '<i class="fas fa-heart"></i> Saved';
        }
        
        this.saveSavedRecipes();
        this.updateSavedRecipesList();
    }

    // Show recipe modal
    showRecipeModal(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="modal-recipe">
                <div class="modal-recipe-header">
                    <h2>${recipe.name}</h2>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.cookingTime} minutes</span>
                        <span><i class="fas fa-tag"></i> ${this.capitalizeFirst(recipe.cuisine)}</span>
                        <span><i class="fas fa-leaf"></i> ${this.capitalizeFirst(recipe.diet)}</span>
                    </div>
                </div>
                <div class="modal-recipe-content">
                    <p class="recipe-description">${recipe.description}</p>
                    <div id="recipeHints"></div>
                    <div class="ingredients-section">
                        <h3><i class="fas fa-list"></i> Ingredients</h3>
                        <ul class="ingredients-list">
                            ${recipe.ingredients.map(ingredient => `
                                <li>${this.capitalizeFirst(ingredient)}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="instructions-section">
                        <h3><i class="fas fa-clipboard-list"></i> Instructions</h3>
                        <ol class="instructions-list">
                            ${recipe.instructions.map(instruction => `
                                <li>${instruction}</li>
                            `).join('')}
                        </ol>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="save-btn ${this.savedRecipes.has(recipe.id) ? 'saved' : ''}" 
                                data-recipe-id="${recipe.id}">
                            <i class="fas fa-heart"></i> 
                            ${this.savedRecipes.has(recipe.id) ? 'Saved' : 'Save Recipe'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('recipeHints').innerHTML = this.generateAdvisorHints(recipe);
        // Add save button listener
        modalBody.querySelector('.save-btn').addEventListener('click', () => {
            this.toggleSaveRecipe(recipe.id);
        });
        
        document.getElementById('recipeModal').style.display = 'block';
    }

    // Show loading state
    showLoading() {
        document.getElementById('recipeResults').innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;
    }

    // Show welcome message
    showWelcomeMessage() {
        document.getElementById('aiReasoning').style.display = 'none';
        document.getElementById('recipeResults').innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-utensils"></i>
                <h2>Welcome to Recipe AI</h2>
                <p>Enter your available ingredients and let our AI find the perfect recipes for you!</p>
            </div>
        `;
    }

    // Update saved recipes list in sidebar
    updateSavedRecipesList() {
        const savedList = document.getElementById('savedList');
        
        if (this.savedRecipes.size === 0) {
            savedList.innerHTML = '<p class="empty-state">No saved recipes yet</p>';
            return;
        }
        
        const savedRecipeData = Array.from(this.savedRecipes).map(id => 
            this.recipes.find(recipe => recipe.id === id)
        ).filter(Boolean);
        
        savedList.innerHTML = savedRecipeData.map(recipe => `
            <div class="saved-item" data-recipe-id="${recipe.id}">
                <h4>${recipe.name}</h4>
                <p>${recipe.cookingTime} min • ${this.capitalizeFirst(recipe.cuisine)}</p>
            </div>
        `).join('');
        
        // Add click listeners
        savedList.querySelectorAll('.saved-item').forEach(item => {
            item.addEventListener('click', () => {
                const recipeId = parseInt(item.dataset.recipeId);
                this.showRecipeModal(recipeId);
            });
        });
    }

    // Save/load saved recipes from localStorage
    saveSavedRecipes() {
        localStorage.setItem('savedRecipes', JSON.stringify(Array.from(this.savedRecipes)));
    }

    loadSavedRecipes() {
        const saved = localStorage.getItem('savedRecipes');
        if (saved) {
            this.savedRecipes = new Set(JSON.parse(saved));
        }
    }

    // Utility function to capitalize first letter
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    getRecommendations(userIngredients) {
        const selectedSet = new Set(userIngredients.map(i => this.normalizeIngredient(i)));

        // --- DEBUG: see what ingredients AI sees ---
        console.log("Selected Set:", Array.from(selectedSet));
        // -----------------------------------------

        let filteredRecipes = [...this.recipes];

        // Apply filters with normalization
        const cuisineFilter = document.getElementById('cuisineFilter').value.trim().toLowerCase();
        if (cuisineFilter) {
            filteredRecipes = filteredRecipes.filter(r => r.cuisine.toLowerCase() === cuisineFilter);
        }

        const dietFilter = document.getElementById('dietFilter').value.trim().toLowerCase();
        if (dietFilter) {
            filteredRecipes = filteredRecipes.filter(r => r.diet.toLowerCase() === dietFilter);
        }

        const timeFilter = document.getElementById('timeFilter').value;
        if (timeFilter) {
            filteredRecipes = filteredRecipes.filter(r => r.cookingTime <= parseInt(timeFilter));
        }


        // Score recipes using the userIngredients set
        filteredRecipes.forEach(r => {
            const matchedIngredients = r.ingredients.filter(i => selectedSet.has(this.normalizeIngredient(i)));
            const matched = matchedIngredients; // <-- for console log
            console.log(r.name, "matched:", matched);
            r._score = (matchedIngredients.length / r.ingredients.length) * 100; // basic match %
            r.matchedIngredients = matchedIngredients;
            r.percentage = Math.round(r._score);
            r.reasoning = this.generateReasoning(r, matchedIngredients, userIngredients);
        });

        filteredRecipes.sort((a, b) => b._score - a._score);

        const topRecipes = filteredRecipes.slice(0, 3);

        this.displayResults(topRecipes, userIngredients);





        const recipeMatches = filteredRecipes.map(r => ({
            name: r.name,
            matchPercent: r.percentage
        }));

        console.log('Recipe Matches Data:', recipeMatches);
        console.log('Ingredients Count:', userIngredients.length, 'Recipes Found:', filteredRecipes.length);


        // Optional: update advisor hints for top recipe
        if (topRecipes.length > 0) {
            const recipeHintsDiv = document.getElementById('recipeHints');
            if (recipeHintsDiv) recipeHintsDiv.innerHTML = this.generateAdvisorHints(topRecipes[0]);
        }

        return topRecipes;
    }


    // Option B: Advisor hints for top recipe
    generateAdvisorHints(recipe) {
        const selected = Array.from(this.selectedIngredients).map(i => i.toLowerCase());
        const matchedCount = recipe.ingredients.filter(i => selected.includes(i.toLowerCase())).length;
        const matchPercent = Math.round((matchedCount / recipe.ingredients.length) * 100);

        let hints = '';
        hints += `<p>This recipe uses ${matchPercent}% of your available ingredients → less wastage.</p>`;
        if (recipe.cookingTime <= 30) hints += `<p>This dish is <30 min → good for busy evenings.</p>`;
        if (recipe.diet) hints += `<p>Diet type: ${this.capitalizeFirst(recipe.diet)}</p>`;

        return hints;
    }

    // Scoring function (Option C)
    calculateRecipeScore(recipe) {
        const selected = Array.from(this.selectedIngredients).map(i => i.toLowerCase());

        // Ingredient match %
        const matchedIngredients = recipe.ingredients.filter(i => selected.includes(i.toLowerCase()));
        const matchPercent = matchedIngredients.length / recipe.ingredients.length;

        // Cooking time score (normalize to 60 min)
        const timeScore = 1 - (recipe.cookingTime / 60);

        // Diet score (if user selects a diet filter)
        const preferredDiet = document.getElementById('dietFilter').value.toLowerCase();
        const dietScore = (preferredDiet && recipe.diet.toLowerCase() === preferredDiet) ? 1 : 0;

        // Weighted final score
        return (0.5 * matchPercent) + (0.3 * timeScore) + (0.2 * dietScore);
    }
}

// Initialize the Recipe AI system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RecipeAI();
});
// Add some additional modal styles
const modalStyles = `
    .modal-recipe-header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f0f0f0;
    }
    
    .modal-recipe-header h2 {
        color: #333;
        margin-bottom: 15px;
        font-size: 2rem;
    }
    
    .recipe-description {
        font-size: 1.1rem;
        color: #666;
        text-align: center;
        margin-bottom: 30px;
        font-style: italic;
    }
    
    .ingredients-section, .instructions-section {
        margin-bottom: 30px;
    }
    
    .ingredients-section h3, .instructions-section h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
        color: #333;
        font-size: 1.3rem;
    }
    
    .ingredients-list, .instructions-list {
        padding-left: 20px;
    }
    
    .ingredients-list li, .instructions-list li {
        margin-bottom: 8px;
        line-height: 1.6;
    }
    
    .modal-actions {
        text-align: center;
        padding-top: 20px;
        border-top: 2px solid #f0f0f0;
    }
    
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: #666;
    }
    
    .no-results i {
        font-size: 4rem;
        color: #ccc;
        margin-bottom: 20px;
    }
    
    .no-results h3 {
        margin-bottom: 15px;
        color: #333;
    }
    
    .suggestions {
        margin-top: 30px;
        text-align: left;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .suggestions h4 {
        margin-bottom: 15px;
        color: #333;
    }
    
    .suggestions p {
        margin-bottom: 8px;
        color: #666;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);