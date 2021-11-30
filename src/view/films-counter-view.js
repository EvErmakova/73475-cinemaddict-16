import {createElement} from '../render';

const createFilmsCounterTemplate = (count) => (
  `<p>${count} movies inside</p>`
);

export default class FilmsCounterView {
  #element = null;
  #count = null;

  constructor(count) {
    this.#count = count;
  }

  get template() {
    return createFilmsCounterTemplate(this.#count);
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
