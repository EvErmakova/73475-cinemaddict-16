import AbstractView from './abstract-view';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title"></h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsListView extends AbstractView {
  get template() {
    return createFilmsListTemplate();
  }
}
