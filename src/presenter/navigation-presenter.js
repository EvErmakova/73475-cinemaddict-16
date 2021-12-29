import {FilterType, ScreenType, UpdateType} from '../const';
import {filter} from '../utils/filters';
import {render, replace, remove} from '../utils/render';
import NavigationView from '../view/navigation-view';

export default class NavigationPresenter {
  #navigationContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #handleNavigationClick = () => {};
  #activeItem = FilterType.ALL.type;
  #screenType = ScreenType.FILMS;

  #navigationComponent = null;

  constructor(navigationContainer, filterModel, filmsModel, handleNavigationClick) {
    this.#navigationContainer = navigationContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#handleNavigationClick = handleNavigationClick;

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
    const prevNavigationComponent = this.#navigationComponent;

    this.#navigationComponent = new NavigationView(filters, this.#activeItem);
    this.#navigationComponent.setItemClickHandler(this.#handleNavigationChange);

    if (prevNavigationComponent === null) {
      render(this.#navigationContainer, this.#navigationComponent);
      return;
    }

    replace(this.#navigationComponent, prevNavigationComponent);
    remove(prevNavigationComponent);
  }

  #handleModelEvent = (updateType) => {
    if (updateType !== UpdateType.PATCH) {
      this.init();
    }
  }

  #handleNavigationChange = (activeItem) => {
    if (this.#activeItem === activeItem) {
      return;
    }

    this.#activeItem = activeItem;
    const prevScreenType = this.#screenType;

    if (this.filters.some((item) => item.type === activeItem)) {
      this.#filterModel.setFilter(UpdateType.MAJOR, activeItem);
      this.#screenType = ScreenType.FILMS;
    } else {
      this.#screenType = activeItem;
    }

    console.log(prevScreenType, this.#screenType);
    if (prevScreenType !== this.#screenType) {
      this.#handleNavigationClick(this.#screenType);
    }

    this.init();
  }
}
