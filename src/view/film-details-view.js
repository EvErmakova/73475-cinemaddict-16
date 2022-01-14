import he from 'he';
import {EMOTIONS} from '../const';
import {formatDate, formatDuration, getTimeFromNow} from '../utils/date';
import SmartView from './smart-view';

const CONTROL_ACTIVE_CLASS = 'film-details__control-button--active';

const createFilmsGenreTemplate = (genre) => (
  `<span class="film-details__genre">${genre}</span>`
);

const createEmojiItemTemplate = (emoji, activeEmoji, isDisabled) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}"
    value="${emoji}" ${activeEmoji === emoji ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img data-emoji="${emoji}" src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createFilmsCommentTemplate = ({id, author, comment, date, emotion}, isDeleting) => (
  `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${getTimeFromNow(date)}</span>
        <button class="film-details__comment-delete" data-comment="${id}" ${isDeleting ? 'disabled' : ''}>
          ${isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </p>
    </div>
  </li>`
);

const createCommentsTemplate = (comments, activeEmoji, commentText, isDisabled, deletingCommentId) => {
  const commentsList = comments.map((comment) => (
    createFilmsCommentTemplate(comment, deletingCommentId === comment.id)
  )).join('\n');
  const emojiList = EMOTIONS.map((emoji) => createEmojiItemTemplate(emoji, activeEmoji, isDisabled)).join('\n');

  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">
      Comments <span class="film-details__comments-count">${comments.length}</span>
    </h3>

    <ul class="film-details__comments-list">
      ${commentsList}
    </ul>

    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
          ${activeEmoji ? `<img src="images/emoji/${activeEmoji}.png" width="55" height="55" alt="emoji-${activeEmoji}">` : ''}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here"
        name="comment" ${isDisabled ? 'disabled' : ''}>${commentText ? he.encode(commentText) : ''}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiList}
      </div>
    </div>
  </section>`;
};

const createFilmDetailsTemplate = ({
  film: {filmInfo, userDetails, activeEmoji, commentText},
  comments,
  isDisabled,
  deletingCommentId
}) => {
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
  const commentsTemplate = createCommentsTemplate(comments, activeEmoji, commentText, isDisabled, deletingCommentId);

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
                <td class="film-details__cell">${formatDate(release.date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatDuration(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genre.length > 1 ? 'Genres': 'Genre'}</td>
                <td class="film-details__cell">
                  ${genres}
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
        ${commentsTemplate}
      </div>
    </form>
  </section>`;
};

export default class FilmDetailsView extends SmartView {
  constructor(film, comments) {
    super();
    this._data = {
      film: FilmDetailsView.parseFilmToData(film),
      comments: comments
    };

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._data);
  }

  get filmData() {
    return this._data.film;
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseDetailsHandler(this._callback.closeDetailsClick);
    this.setControlClickHandler(this._callback.controlClick);
    this.setDeleteCommentHandler(this._callback.deleteCommentClick);
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

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => {
      button.addEventListener('click', this.#deleteCommentHandler);
    });
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-label img').forEach((item) => {
      item.addEventListener('click', this.#emojiClickHandler);
    });

    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  #closeDetailsHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeDetailsClick();
  }

  #controlClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.controlClick(
      FilmDetailsView.parseDataToFilm(this._data.film),
      evt.target.getAttribute('name')
    );
  }

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentClick(evt.target.dataset.comment);
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      film: {
        ...this._data.film,
        activeEmoji: evt.target.dataset.emoji
      }
    });
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      film: {
        ...this._data.film,
        commentText: evt.target.value
      }
    }, true);
  }

  static parseFilmToData = (film) => ({
    ...film,
    activeEmoji: null,
    commentText: null,
  });

  static parseDataToFilm = (data) => {
    const film = {...data};

    delete film.activeEmoji;
    delete film.commentText;

    return film;
  }
}
