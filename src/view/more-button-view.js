import {createElement} from '../render';

const createMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class MoreButtonView {
  #element = null;

  get template() {
    return createMoreButtonTemplate();
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
