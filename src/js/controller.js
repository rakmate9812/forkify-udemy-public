import * as model from './model.js';
import recipeView from './views/recipeView.js'; // default export, barmi lehet a neve
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSING_MSECONDS } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// if (module.hot) {
//   module.hot.accept();
// }

// ////
// Controlling recipes
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // Update results view to mark active the selected result (also the bookmark if bookmarked)
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    // Loading spinner until load
    recipeView.renderSpinnner();

    // Update result view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// Calling and displaying the loadSearch results
const controlSearchRecipes = async function () {
  try {
    resultsView.renderSpinnner();

    // 1 - Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2 - Load search results
    await model.loadSearchResult(query);
    // console.log(model.state.search.results);

    // 3 - Render search results
    resultsView.render(model.getSearchResultPage());

    // 4 Render page number buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // console.log(goToPage);

  // 1 - Render NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2 Render NEW page number buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings
  model.updateServings(newServings);

  // Update recipe View
  // recipeView.render(model.state.recipe); // old render method
  recipeView.update(model.state.recipe); // new render(update) method
};

const controlAddBookmark = function () {
  // 1 - Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2 - Update recipe view
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // 3 - Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinnner();
    // Adding/Uploading new recipe
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
// ////////////////////////////////////////////
// Program initializing
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
