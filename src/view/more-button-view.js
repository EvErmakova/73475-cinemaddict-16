import AbstractView from './abstract-view';

const createMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class MoreButtonView extends AbstractView {
  get template() {
    return createMoreButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
