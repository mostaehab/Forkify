import { config } from './config';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: config.RES_PAG,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${config.API_URL}/${id}?key=${config.KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(
      `${config.API_URL}?search=${query}&key=${config.KEY}`
    );
    const { recipes } = data.data;
    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const updateIngredients = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const bookmarkStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  console.log(state.bookmarks);

  bookmarkStorage();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(ele => ele.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
};

export const uploadRecipe = async function (recipeData) {
  try {
    const ingredient = Object.entries(recipeData)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong Ingredient format! Please use the correct format :)'
          );
        }
        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? +quantity : null,
          unit: unit,
          description: description,
        };
      });

    const recipe = {
      title: recipeData.title,
      source_url: recipeData.sourceUrl,
      image_url: recipeData.image,
      publisher: recipeData.publisher,
      cooking_time: +recipeData.cookingTime,
      servings: +recipeData.servings,
      ingredients: ingredient,
    };

    const data = await AJAX(`${config.API_URL}/?key=${config.KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);

  console.log(state.bookmarks);
};
init();
