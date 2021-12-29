import SmartView from './smart-view';
import {StatsFilterType} from '../const';

const createFilterItemTemplate = ({name, type, checked}) => (
  `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
    id="statistic-${type}" value="${type}" ${checked ? 'checked' : ''}>
  <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`
);

const createStatsTemplate = ({rank, activeFilter, totalCount, totalDuration, topGenre}) => {
  const filters = Object.values(StatsFilterType).map((filter) => (
    createFilterItemTemplate({...filter, checked: activeFilter === filter.type})
  )).join('\n');

  return `<section class="statistic">
    ${rank ? `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
    </p>` : ''}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${filters}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${totalCount || 0} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
          ${totalDuration.hours > 0 ? `${totalDuration.hours} <span class="statistic__item-description">h</span>` : ''}
          ${totalDuration.minutes || 0} <span class="statistic__item-description">m</span>
        </p>
      </li>
      ${topGenre ? `<li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>` : ''}
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class StatsView extends SmartView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createStatsTemplate(this._data);
  }

  setFilterChangeHandler = (callback) => {
    this._callback.filterChange = callback;
    this.element.querySelector('.statistic__filters').addEventListener('change', this.#filterChangeHandler);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterChange(evt.target.value);
  }

  restoreHandlers = () => {
    this.setFilterChangeHandler(this._callback.filterChange);
  }
}
