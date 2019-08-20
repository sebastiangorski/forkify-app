// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* ---Global state of the app---
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
*/
const state = {};
window.state = state;

// ---SEARCH CONTROLLER---
const controlSearch = async () => {
    // 1. Get query form view
    const query = searchView.getInput();

    if (query) { // If there is a query
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes - we want to render result after we recaive data from API, so we await and do it as async
           await state.search.getResults();
    
            // 5. Render results on UI
            clearLoader();  
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something wrong with the search...');
        }
    }
}

elements.searchForm.addEventListener('submit', e => { // e = event object
    e.preventDefault(); // Prevent from reload
    controlSearch();
});


// We have to use event delegations, since the buttons are not aviable on load
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // So that no matter where we click on the button (on the icon, or span) it will find the closest element with the btn-inline class

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // Reading from HTML attribute from data-goto-value, also convert string to a number with the base number of 10
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// ---RECIPE CONTROLLER---
const controlRecipe = async () => {
    // Get ID from URL
    const id = window.location.hash.replace('#', ''); // Replace hash symbol with nothing so we get only numbers
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data nad parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );

        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// windows.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// ---LIST CONTROLLER---
const controlList = () => {
    // 1. Create new list IF there is none yet
    if (!state.list) state.list = new List();

    // 2. Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

};

// Handle delete and update list item event
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10); // e.target is now a input element so we can read value
        state.list.updateCount(id, val);
    }

});


// ---LIKE CONTROLLER---

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT liked curret recipe yet  
    if (!state.likes.isLiked(currentID)) {
        // Add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);
    
    // User HAS liked curret recipe yet  
    } else {
        // Remove like from state
        state.likes.deleteLike(currentID);

        // Toggle like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { // btn-decrease and any of its child
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) { // btn-decrease and any of its child
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

window.l = new List();


