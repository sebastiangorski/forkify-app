// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/* ---Global state of the app---
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
*/
const state = {};

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

        // 4. Search for recipes - we want to render result after we recaive data from API, so we await and do it as async
       await state.search.getResults();

        // 5. Render results on UI
        clearLoader();  
        searchView.renderResults(state.search.result);
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
        const goToPage = parseInt(btn.dataset.goto, 10); // Reading from HTML attribute from data-goto-value, also conveet string to a number with the base number of 10
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});




