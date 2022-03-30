import * as model from './model.js';
import recipeView from './views/recipeView.js';
import bookmarkView from './views/bookmarkView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { config } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//Parcel Reloading state

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //Rendring Spinner
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultPage());

    bookmarkView.update(model.state.bookmarks);
    //Getting recipe data.
    await model.loadRecipe(id);

    //Rendring recipe data
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(recipeView._errorMsg);
  }
};

const searchRecipesController = async function () {
  try {
    //Rendring Spinner
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultPage());

    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(resultsView._errorMsg);
  }
};

const paginationController = function (goToPage) {
  resultsView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search);
};

const servingsController = function (update) {
  model.updateIngredients(update);
  recipeView.update(model.state.recipe);
};

const bookmarkController = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRicpe) {
  try {
    await model.uploadRecipe(newRicpe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderSpinner();

    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleHidden();
    }, config.MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

//initialize the app
const init = function () {
  bookmarkView.bookmarkHandler(controlBookmark);
  recipeView.addEventHandler(showRecipe);
  searchView.addHandlerSearch(searchRecipesController);
  paginationView.addHandlerClick(paginationController);
  recipeView.updateServings(servingsController);
  recipeView.addBookmarkHandler(bookmarkController);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
