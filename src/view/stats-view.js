import SmartView from './smart-view';
import {StatsFilterType, UpdateType} from '../const';

const createFilterItemTemplate = ({name, type, checked}) => (
  `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
    id="statistic-${type}" value="${type}" ${checked ? 'checked' : ''}>
  <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`
);

const createStatsTemplate = ({rank, activeFilter}) => {
  const filters = Object.values(StatsFilterType).map((filter) => (
    createFilterItemTemplate({...filter, checked: activeFilter === filter.type})
  )).join('\n');

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${filters}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">28 <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">69 <span class="statistic__item-description">h</span> 41 <span
          class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">Drama</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class StatsView extends SmartView {
  #filmsModel = null;

  constructor(filmsModel) {
    super();
    this.#filmsModel = filmsModel;
    this._data = {
      rank: this.#filmsModel.userRank,
      activeFilter: StatsFilterType.ALL.type
    };
    this.#filmsModel.addObserver(this.#handleModelEvent);

    this.#setFilterChangeHandler();
  }

  get template() {
    return createStatsTemplate(this._data);
  }

  #setFilterChangeHandler = () => {
    this.element.querySelector('.statistic__filters').addEventListener('change', this.#filterChangeHandler);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      ...this._data,
      activeFilter: evt.target.value
    });
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MINOR) {
      this.updateData({});
    }
  }

  restoreHandlers = () => {
    this.#setFilterChangeHandler();
  }
}
