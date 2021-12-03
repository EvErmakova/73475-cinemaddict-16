import AbstractView from './abstract-view';

const createFilmsCounterTemplate = (count) => (
  `<p>${count} movies inside</p>`
);

export default class FilmsCounterView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createFilmsCounterTemplate(this.#count);
  }
}
