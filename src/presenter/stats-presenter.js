import {StatsFilterType, UpdateType} from '../const';
import {getDuration} from '../utils/date';
import {remove, render} from '../utils/render';
import {getGenresStats, isFilmWatchedInPeriod} from '../utils/stats';
import StatsView from '../view/stats-view';

export default class StatsPresenter {
  #statsContainer = null;
  #statsComponent = null;

  #filmsModel = null;
  #activeFilter = null;

  constructor(statsContainer, filmsModel) {
    this.#statsContainer = statsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#activeFilter = StatsFilterType.ALL.type;
    this.#renderStats(this.stats);
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    return this.#filmsModel.watchedFilms;
  }

  get stats() {
    const films = this.films.filter((film) => isFilmWatchedInPeriod(film, this.#activeFilter));
    const genresStats = getGenresStats(films);
    let totalDuration = 0;

    films.forEach((film) => {
      totalDuration += film.filmInfo.runtime;
    });

    totalDuration = getDuration(totalDuration);

    return {
      rank: this.#filmsModel.userRank,
      activeFilter: this.#activeFilter,
      totalCount: films.length,
      totalDuration,
      topGenre: genresStats ? [...genresStats.keys()][0] : null,
      genresStats
    };
  }

  destroy = () => {
    remove(this.#statsComponent);
    this.#filmsModel.removeObserver(this.#handleModelEvent);
  }

  #renderStats = (data) => {
    this.#statsComponent = new StatsView(data);
    render(this.#statsContainer, this.#statsComponent);
    this.#statsComponent.setFilterChangeHandler(this.#handleFilterChange);
  }

  #handleFilterChange = (activeFilter) => {
    this.#activeFilter = activeFilter;
    remove(this.#statsComponent);
    this.#renderStats(this.stats);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MINOR) {
      remove(this.#statsComponent);
      this.#renderStats(this.stats);
    }
  }
}
