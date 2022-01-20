import {MAX_DESCRIPTION_LENGTH} from '../const';
import {getYear, formatDuration} from '../utils/date';
import SmartView from './smart-view';

const CONTROL_ACTIVE_CLASS = 'film-card__controls-item--active';

const createFilmCardTemplate = ({filmInfo, userDetails, comments}) => {
  const {title, totalRating, release, runtime, genre, poster, description} = filmInfo;

  const watchlistClassName = userDetails.watchlist ? CONTROL_ACTIVE_CLASS : '';
  const watchedClassName = userDetails.alreadyWatched ? CONTROL_ACTIVE_CLASS : '';
  const favoriteClassName = userDetails.favorite ? CONTROL_ACTIVE_CLASS : '';

  const getShortDescription = () => {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;
    }
    return description;
  };

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getYear(release.date)}</span>
        <span class="film-card__duration">${formatDuration(runtime)}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getShortDescription()}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button name="watchlist" class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
      <button name="watched" class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
      <button name="favorite" class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends SmartView {
  constructor(film) {
    super();
    this._data = film;
  }

  get template() {
    return createFilmCardTemplate(this._data);
  }

  get filmData() {
    return this._data;
  }

  restoreHandlers = () => {
    this.setOpenDetailsHandler(this._callback.openDetailsClick);
    this.setControlClickHandler(this._callback.controlClick);
  }

  setOpenDetailsHandler = (callback) => {
    this._callback.openDetailsClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openDetailsHandler);
  }

  setControlClickHandler = (callback) => {
    this._callback.controlClick = callback;
    this.element.querySelectorAll('.film-card__controls-item').forEach((control) => {
      control.addEventListener('click', this.#controlClickHandler);
    });
  }

  #openDetailsHandler = (evt) => {
    evt.preventDefault();
    this._callback.openDetailsClick();
  }

  #controlClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.controlClick(this._data, evt.target.getAttribute('name'));
  }
}
