import View from './View';
import PreviewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMsg = 'There is no results for your query. Please try another one!';

  _generateMarkUp() {
    return this._data.map(recipe => PreviewView.render(recipe, false)).join('');
  }
}

export default new ResultsView();
