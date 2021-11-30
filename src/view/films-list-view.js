import {createElement} from '../render';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title"></h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsListView {
  #element = null;

  get template() {
    return createFilmsListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
