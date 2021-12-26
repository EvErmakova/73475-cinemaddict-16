import {SortType} from '../const';
import AbstractView from './abstract-view';

const createSortItemTemplate = (type, isActive) => (
  `<li>
    <a href="#" class="sort__button ${isActive ? 'sort__button--active' : '' }" data-sort-type="${type}">
        Sort by ${type}
    </a>
  </li>`
);

const createSortTemplate = (activeType) => {
  const sortList = Object.values(SortType).map((type) => (
    createSortItemTemplate(type, type === activeType)
  )).join('\n');
  return `<ul class="sort">${sortList}</ul>`;
};

export default class SortView extends AbstractView {
  #activeType = null;

  constructor(activeType) {
    super();
    this.#activeType = activeType;
  }

  get template() {
    return createSortTemplate(this.#activeType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.querySelectorAll('.sort__button').forEach((sortButton) => {
      sortButton.addEventListener('click', this.#sortTypeChangeHandler);
    });
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
