import {EMOTIONS} from '../const';
import {getFormatDate, getFormatTime} from '../utils/date';
import AbstractView from './abstract-view';

const CONTROL_ACTIVE_CLASS = 'film-details__control-button--active';

const createFilmsGenreTemplate = (genre) => (
  `<span class="film-details__genre">${genre}</span>`
);

const createEmojiItemTemplate = (emoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createFilmDetailsTemplate = ({filmInfo, userDetails, comments}) => {
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
  const emojiList = EMOTIONS.map(createEmojiItemTemplate).join('\n');

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
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsQuantity}</span></h3>

          <ul class="film-details__comments-list">
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

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

export default class FilmDetailsView extends AbstractView {
  #film;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film);
  }

  setCloseDetailsHandler = (callback) => {
    this._callback.closeDetailsClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeDetailsHandler);
  }

  #closeDetailsHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeDetailsClick();
  }
}
