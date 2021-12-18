import {SORT_TYPE} from '../const';
import AbstractView from './abstract-view';

const createSortItemTemplate = (type) => (
  `<li><a href="#" class="sort__button" data-sort-type="${type}">Sort by ${type}</a></li>`
);

const createSortTemplate = () => {
  const sortList = SORT_TYPE.map(createSortItemTemplate).join('\n');
  return `<ul class="sort">${sortList}</ul>`;
};

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
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
