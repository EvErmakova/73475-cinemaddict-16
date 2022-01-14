import AbstractView from './abstract-view';

const createFilmsCounterTemplate = (count) => (
  `<p>${count} movies inside</p>`
);

export default class FilmsCounterView extends AbstractView {
  #count = null;

  constructor(filmsModel) {
    super();
    this.#count = filmsModel.films.length;
  }

  get template() {
    return createFilmsCounterTemplate(this.#count);
  }
}
