import {EMOTIONS} from '../const';
import {getFormatDate, getFormatTime} from '../utils/date';
import SmartView from './smart-view';
import FilmCommentView from './film-comment-view';

const CONTROL_ACTIVE_CLASS = 'film-details__control-button--active';

const createFilmsGenreTemplate = (genre) => (
  `<span class="film-details__genre">${genre}</span>`
);

const createEmojiItemTemplate = (emoji, activeEmoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}"
    value="${emoji}" ${activeEmoji === emoji ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img data-emoji="${emoji}" src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createFilmDetailsTemplate = ({filmInfo, userDetails, comments, activeEmoji}, commentsData) => {
  const {
    poster,
    ageRating,
    title,
    alternativeTitle,
    totalRating,
    director,
    writers,
    actors,
    release,
    runtime,
    description,
    genre
  } = filmInfo;

  const watchlistClassName = userDetails.watchlist ? CONTROL_ACTIVE_CLASS : '';
  const watchedClassName = userDetails.alreadyWatched ? CONTROL_ACTIVE_CLASS : '';
  const favoriteClassName = userDetails.favorite ? CONTROL_ACTIVE_CLASS : '';

  const genres = genre.map(createFilmsGenreTemplate).join('');

  const commentsQuantity = comments.length;

  const commentsList = commentsData.map((comment) => new FilmCommentView(comment).template).join('\n');
  const emojiList = EMOTIONS.map((emoji) => createEmojiItemTemplate(emoji, activeEmoji)).join('\n');

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getFormatDate(release.date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getFormatTime(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${genres}
                  <span class="film-details__genre">Drama</span>
                  <span class="film-details__genre">Film-Noir</span>
                  <span class="film-details__genre">Mystery</span>
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button name="watchlist" type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist">Add to watchlist</button>
          <button name="watched" type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched">Already watched</button>
          <button name="favorite" type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsQuantity}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsList}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
                ${activeEmoji ? `<img src="images/emoji/${activeEmoji}.png" width="55" height="55" alt="emoji-${activeEmoji}">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              ${emojiList}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetailsView extends SmartView {
  #comments = [];

  constructor(film, comments) {
    super();
    this._data = FilmDetailsView.parseFilmToData(film);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._data, this.#comments);
  }

  get filmData() {
    return this._data;
  }

  set filmData(filmData) {
    this._data = filmData;
  }

  updateControl = (controlType) => {
    this.element.querySelector(`[name = ${controlType}]`).classList.toggle(CONTROL_ACTIVE_CLASS);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseDetailsHandler(this._callback.closeDetailsClick);
    this.setControlClickHandler(this._callback.controlClick);
  }

  setCloseDetailsHandler = (callback) => {
    this._callback.closeDetailsClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeDetailsHandler);
  }

  setControlClickHandler = (callback) => {
    this._callback.controlClick = callback;
    this.element.querySelectorAll('.film-details__control-button').forEach((control) => {
      control.addEventListener('click', this.#controlClickHandler);
    });
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-label img').forEach((item) => {
      item.addEventListener('click', this.#emojiClickHandler);
    });
  }

  #closeDetailsHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeDetailsClick();
  }

  #controlClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.controlClick(FilmDetailsView.parseDataToFilm(this._data), evt.target.getAttribute('name'));
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      activeEmoji: evt.target.dataset.emoji
    });
  }

  static parseFilmToData = (film) => ({
    ...film,
    activeEmoji: film.activeEmoji
  });

  static parseDataToFilm = (data) => {
    const film = {...data};

    if (!film.activeEmoji) {
      film.activeEmoji = null;
    }

    delete film.activeEmoji;

    return film;
  }
}
