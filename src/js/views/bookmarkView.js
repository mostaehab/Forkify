import View from './View';
import PreviewView from './previewView.js';

class BoomarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMsg = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  bookmarkHandler(handler) {
    window.addEventListener('load', handler());
  }

  _generateMarkUp() {
    return this._data
      .map(bookmark => PreviewView.render(bookmark, false))
      .join('');
  }
}

export default new BoomarksView();
