import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkUp();
    if (!render) return markup;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const newMarkUp = this._generateMarkUp();
    const newDom = document.createRange().createContextualFragment(newMarkUp);
    const newElemnts = Array.from(newDom.querySelectorAll('*'));
    const curElemnts = Array.from(this._parentElement.querySelectorAll('*'));

    newElemnts.forEach((newEl, i) => {
      const curEl = curElemnts[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const html = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderError(eMsg = this._errorMsg) {
    const html = `
    <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${eMsg}</p>
    </div>`;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }
}
