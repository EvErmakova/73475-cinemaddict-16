import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {StatsFilterType} from '../const';
import SmartView from './smart-view';

const BAR_HEIGHT = 50;

const renderGenresChart = (statisticCtx, genresStats) => (
  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...genresStats.keys()],
      datasets: [{
        data: [...genresStats.values()],
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      }
    }
  })
);

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
  #genresChart = null;

  constructor(data) {
    super();
    this._data = data;

    this.#renderChart(this._data);
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

  #renderChart = ({genresStats}) => {
    if (genresStats === null) {
      return;
    }

    const statisticCtx = this.element.querySelector('.statistic__chart');
    statisticCtx.height = BAR_HEIGHT * genresStats.size;

    this.#genresChart = renderGenresChart(statisticCtx, genresStats);
  }

  restoreHandlers = () => {
    this.setFilterChangeHandler(this._callback.filterChange);
    this.#renderChart(this._data);
  }
}
