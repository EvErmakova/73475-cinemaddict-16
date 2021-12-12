import AbstractView from './abstract-view';

const createFilmsListTemplate = (title) => (
  `<section class="films-list">
    <h2 class="films-list__title">${title}</h2>
  </section>`
);

export default class FilmsListView extends AbstractView {
  #title = '';

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createFilmsListTemplate(this.#title);
  }
}
