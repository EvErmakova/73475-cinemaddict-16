import {FilterType, UpdateType} from '../const';
import {filter} from '../utils/filters';
import {render, replace, remove} from '../utils/render';
import FiltersView from '../view/filters-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const filters = [];
    const films = this.#filmsModel.films;

    Object.values(FilterType).forEach(({type, name}) => {
      filters.push({type, name, count: filter[type](films).length});
    });

    return filters;
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filters, this.#filterModel.filter);
    this.#filterComponent.setTypeChangeHandler(this.#handleTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleTypeChange = (type) => {
    if (this.#filterModel.filter === type) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, type);
  }
}
