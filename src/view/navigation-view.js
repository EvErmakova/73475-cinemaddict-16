import AbstractView from './abstract-view';

const createItemTemplate = ({type, name, count}, isActive) => (
  `<a href="#${type}" data-menu="${type}"
    class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}"
  >
    ${name} ${type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
  </a>`
);

const createNavigationTemplate = (filters, activeItem) => {
  const filterList = filters.map((filter) => (
    createItemTemplate(filter, filter.type === activeItem)
  )).join('\n');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterList}
    </div>
    <a href="#stats" data-menu="stats"
      class="main-navigation__additional ${activeItem === 'stats' ? 'main-navigation__additional--active' : ''}"
    >
      Stats
    </a>
  </nav>`;
};

export default class NavigationView extends AbstractView {
  #filters = null;
  #activeItem = null;

  constructor(filters, activeItem) {
    super();
    this.#filters = filters;
    this.#activeItem = activeItem;
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#activeItem);
  }

  setItemClickHandler = (callback) => {
    this._callback.itemClick = callback;
    this.element.querySelectorAll('[data-menu]').forEach((item) => {
      item.addEventListener('click', this.#itemClickHandler);
    });
  }

  #itemClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.itemClick(evt.target.closest('[data-menu]').dataset.menu);
  }
}
