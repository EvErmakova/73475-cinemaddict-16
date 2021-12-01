import {createElement} from '../render';

const createNoFilmsTemplate = () => (
  `<section className="films-list">
    <h2 className="films-list__title">There are no movies in our database</h2>
  </section>`
);

export default class NoFilmsView {
  #element = null;

  get template() {
    return createNoFilmsTemplate();
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
