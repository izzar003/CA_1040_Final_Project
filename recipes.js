const recipeDatabase = [
    {
        id: 1,
        title: "Chicken & Rice",
        ingredients: ["chicken", "rice"],
        time: "25 mins",
        img: "images/chicken-rice.jpg",
        steps: [
            "Cook the rice according to packet instructions.",
            "Cook chicken desired way,griled, baked, fried ,etc. until internal temperature of 165 degrees Fahrenheit.",
            "combine on plate and serve hot."
        ]
    },
    {
        id: 2,
        title: "Garlic Butter Pasta",
        ingredients: ["pasta", "butter","garlic"],
        time: "15 mins",
        img: "images/garlic-pasta.jpg",
        steps: [
            "Boil the pasta in salted water until tender.",
            "Melt the butter in a pan over medium heat.",
            "Add minced garlic to the butter and cook for 1 minute or garlic starts to brown.",
            "Drain the pasta and toss it thoroughly in the garlic butter sauce."
        ]
    },
    {
        id: 3,
        title: "Cheesy Egg Scramble",
        ingredients: ["eggs", "cheese"],
        time: "10 mins",
        img: "images/scrambled-eggs.jpg",
        steps: [
            "Crack the eggs into a bowl and whisk them together until yokes and whites are completly mixed.",
            "Pour the eggs into a warm, greased skillet on low to medium heat.",
            "Stir continuously until the eggs begin to set.",
            "Sprinkle cheese on top and fold together until completely melted."
        ]
    },
    {
        id: 4,
        title: "Tomato Pasta Marinara",
        ingredients: ["pasta", "tomato","italian seasoning mix"],
        time: "20 mins",
        img: "images/tomato-pasta.jpg",
        steps: [
            "Boil the pasta until al dente, then drain.",
            "Crush or dice the fresh tomatoes into small pieces.",
            "Simmer the tomatoes in a saucepan with oil, salt, and as much seasioning mix as desired until a sauce forms.",
            "Mix the sauce with your hot pasta, optionally top with cheese if avaliable and serve."
        ]
    },
    {
        id: 5,
        title: "Omelet",
        ingredients: ["eggs", "cheese", "ham"],
        time: "12 mins",
        img: "images/omelet.jpg",
        steps: [
            "Whisk the eggs smoothly in a small container.",
            "Pour into a hot frying pan to form a round layer.",
            "dice ham and place with cheese onto one half of the eggs.",
            "Fold the empty half over the fillings and cook until cheese is gooey."
        ]
    },
    {
        id: 6,
        title: "Cheesy Garlic Bread",
        ingredients: ["bread", "butter", "cheese", "garlic"],
        time: "8 mins",
        img: "images/garlic-bread.jpg",
        steps: [
            "cook minced garlic in pan until fragrent and add to room temperature butter.",
            "Spread a generous layer of butter onto your slices of bread.",
            "Top the bread slices with a heavy layer of grated cheese.",
            "Toast in an oven or skillet until the bread is crisp and cheese bubbles."
        ]
    },
    {
        id: 7,
        title: "Fried Rice",
        ingredients: ["rice", "eggs", "soy sauce", "onion"],
        time: "15 mins",
        img: "images/fried-rice.jpg",
        steps: [
            "Add perfered cooking oil in a large pan.",
            "Add pre-cooked cold rice into the pan and fry until hot.",
            "Push rice to the side and cook diced onion until translucent then mix with rice.",
            "Move the rice mixture back to the side and scramble the eggs directly in the open pan space.",
            "Mix the cooked eggs into the rice, add desired amount of soy sauce and toss evenly."
        ]
    },
    {
        id: 8,
        title: "Grilled Cheese Sandwich",
        ingredients: ["bread", "butter", "cheese"],
        time: "5 mins",
        img: "images/grilled-cheese.jpg",
        steps: [
            "Spread butter on the outer sides of your bread slices.",
            "Place cheese between the slices and grill in a warm skillet.",
            "Flip once the bottom bread layer is desired doneness.",
            "repeat on other side until cheese is fully melted."
        ]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initSearchPage();
    initLibraryPage();
    initFavoritesPage();
    initModalControls(); // Connects the close button events
});

//View Controller
function initNavigation() {
    const navLinks = document.querySelectorAll("#main-nav .nav-link");
    const sections = document.querySelectorAll(".view-section");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            const targetId = link.getAttribute("data-target");

            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = "block";
                } else {
                    section.style.display = "none";
                }
            });

            if (targetId === "favorites-view") {
                initFavoritesPage();
            } else if (targetId === "library-view") {
                initLibraryPage();
            }
        });
    });
}

//Local storage controls
function getSavedFavorites() {
    const data = localStorage.getItem("pantryProspectsFavorites");
    return data ? JSON.parse(data) : [];
}

function toggleFavorite(id) {
    let currentFavs = getSavedFavorites();
    if (currentFavs.includes(id)) {
        currentFavs = currentFavs.filter(favId => favId !== id);
    } else {
        currentFavs.push(id);
    }
    localStorage.setItem("pantryProspectsFavorites", JSON.stringify(currentFavs));
}

//Recipe card module
function createRecipeCard(recipe) {
    const savedFavs = getSavedFavorites();
    const isFavorited = savedFavs.includes(recipe.id);
    
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
        <div class="card-img-wrapper">
            <img src="${recipe.img}" alt="${recipe.title}">
            <button class="bookmark-btn ${isFavorited ? 'active' : ''}" data-id="${recipe.id}">
                ${isFavorited ? '♥' : '♡'}
            </button>
        </div>
        <div class="card-info">
            <h3>${recipe.title}</h3>
            <p class="time">⏱ ${recipe.time}</p>
            <p class="ingredients-list">Ingredients: ${recipe.ingredients.join(", ")}</p>
            <p style="font-size: 0.8rem; color: #2E7D32; margin-top: 0.5rem; text-decoration: underline;">Click to view full recipe steps</p>
        </div>
    `;

    //Modal trigger
    card.addEventListener("click", () => {
        const modal = document.getElementById("recipe-modal");
        document.getElementById("modal-title").innerText = recipe.title;
        document.getElementById("modal-time").innerText = `⏱ ${recipe.time}`;
        
        const stepsList = document.getElementById("modal-steps-list");
        stepsList.innerHTML = "";
        
        recipe.steps.forEach(step => {
            const li = document.createElement("li");
            li.innerText = step;
            li.style.marginBottom = "0.5rem";
            stepsList.appendChild(li);
        });

        modal.style.display = "flex";
    });

    //Heart/ favorite link
    const heartBtn = card.querySelector(".bookmark-btn");
    heartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        
        toggleFavorite(recipe.id);
        
        const updatedFavs = getSavedFavorites();
        
        const allMatchingBtns = document.querySelectorAll(`.bookmark-btn[data-id="${recipe.id}"]`);
        allMatchingBtns.forEach(btn => {
            if (updatedFavs.includes(recipe.id)) {
                btn.classList.add("active");
                btn.innerText = "♥";
            } else {
                btn.classList.remove("active");
                btn.innerText = "♡";
            }
        });

        const activeSection = document.querySelector(".view-section[style*='display: block']") || document.querySelector(".view-section:not([style*='display: none'])");
        if (activeSection && activeSection.id === "favorites-view") {
            card.remove();
            if (updatedFavs.length === 0) {
                document.getElementById("favorites-grid").innerHTML = `<p class="no-results">Your bookmarks shelf is empty!</p>`;
            }
        }
    });

    return card;
}

//Modal Window Setup
function initModalControls() {
    const modal = document.getElementById("recipe-modal");
    const closeBtn = document.getElementById("modal-close-btn");
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

//Home View
function initSearchPage() {
    const tokenContainer = document.getElementById("token-container");
    const recipeGrid = document.getElementById("recipe-grid");
    const loader = document.getElementById("loader");

    if (!tokenContainer || !recipeGrid) return;

    const allIngredients = new Set();
    recipeDatabase.forEach(r => r.ingredients.forEach(i => allIngredients.add(i)));

    tokenContainer.innerHTML = ""; 

    allIngredients.forEach(ingredient => {
        const label = document.createElement("label");
        label.className = "token-btn";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = ingredient;
        checkbox.style.display = "none";
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`+ ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}`));
        
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                label.classList.add("active");
                label.childNodes[1].nodeValue = ` ✓ ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}`;
            } else {
                label.classList.remove("active");
                label.childNodes[1].nodeValue = ` + ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}`;
            }
            
            recipeGrid.style.opacity = "0.2";
            if (loader) loader.style.display = "block";
            
            setTimeout(() => {
                if (loader) loader.style.display = "none";
                recipeGrid.style.opacity = "1";
                renderMatches();
            }, 1000);
        });
        
        tokenContainer.appendChild(label);
    });

    function renderMatches() {
        recipeGrid.innerHTML = "";
        const checkedVals = Array.from(document.querySelectorAll("#token-container input:checked")).map(c => c.value);
        
        const matchedRecipes = recipeDatabase.filter(recipe => {
            if (checkedVals.length === 0) return true;
            return recipe.ingredients.some(i => checkedVals.includes(i));
        });

        if (matchedRecipes.length === 0) {
            recipeGrid.innerHTML = `<p class="no-results">No culinary prospects match those criteria. Toggle other configurations!</p>`;
            return;
        }
        
        matchedRecipes.forEach(recipe => recipeGrid.appendChild(createRecipeCard(recipe)));
    }
    
    renderMatches();
}

//Library View
function initLibraryPage() {
    const libraryGrid = document.getElementById("library-grid");
    if (!libraryGrid) return;
    libraryGrid.innerHTML = "";
    recipeDatabase.forEach(recipe => libraryGrid.appendChild(createRecipeCard(recipe)));
}

//Favorites View
function initFavoritesPage() {
    const favoritesGrid = document.getElementById("favorites-grid");
    if (!favoritesGrid) return;
    favoritesGrid.innerHTML = "";
    
    const activeSavedIds = getSavedFavorites();
    const storedMatches = recipeDatabase.filter(r => activeSavedIds.includes(r.id));
    
    if (storedMatches.length === 0) {
        favoritesGrid.innerHTML = `<p class="no-results">Your favorites shelf is empty. Visit the recipe search or complete library to save recipes!</p>`;
        return;
    }
    
    storedMatches.forEach(recipe => favoritesGrid.appendChild(createRecipeCard(recipe)));
}
