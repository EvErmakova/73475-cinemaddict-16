import AbstractView from './abstract-view';

const createItemTemplate = ({type, name, count}, isActive) => (
  `<a href="#${type}" data-filter="${type}"
    class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}"
  >
    ${name} ${ type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
  </a>`
);

const createFiltersTemplate = (filters, type) => {
  const filterList = filters.map((filter) => (
    createItemTemplate(filter, filter.type === type)
  )).join('\n');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterList}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class FiltersView extends AbstractView {
  #filters = null;
  #type = null;

  constructor(filters, type) {
    super();
    this.#filters = filters;
    this.#type = type;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#type);
  }

  setTypeChangeHandler = (callback) => {
    this._callback.typeChange = callback;
    this.element.querySelectorAll('.main-navigation__item').forEach((filterButton) => {
      filterButton.addEventListener('click', this.#typeChangeHandler);
    });
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.typeChange(evt.target.dataset.filter);
  }
}
