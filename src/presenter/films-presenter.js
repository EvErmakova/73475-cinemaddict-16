import {EXTRA_FILM_COUNT} from '../const';
import {updateItem} from '../utils/common';
import {getSortedFilms} from '../utils/film';
import {remove, render, RenderPosition} from '../utils/render';
import FilmsView from '../view/films-view';
import SortView from '../view/sort-view';
import MoreButtonView from '../view/more-button-view';
import FilmsListView from '../view/films-list-view';
import FilmsContainerView from '../view/films-container-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';

const bodyElement = document.body;
const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #boardContainer = null;

  #boardComponent = new FilmsView();
  #sortComponent = new SortView();
  #moreButtonComponent = new MoreButtonView();

  #noFilmsComponent = null;
  #filmsListComponent = new FilmsListView('All movies. Upcoming');
  #filmsContainerComponent = new FilmsContainerView();
  #topFilmsComponent = new FilmsListView('Top rated');
  #viralFilmsComponent = new FilmsListView('Most commented');
  #detailsComponent = null;

  #filmsModel = [];
  #commentsModel = [];
  #renderedCount = FILM_COUNT_PER_STEP;
  #renderedCards = new Map;

  #sortType = 'default';

  constructor(boardContainer, filmsModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  get films() {
    const films = this.#filmsModel.films;
    return this.#sortType === 'default' ? films : getSortedFilms(films, this.#sortType);
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    render(this.#boardContainer, this.#boardComponent);
    this.#renderBoard();
  }

  #handleSortTypeChange = (newSort) => {
    if (this.#sortType === newSort) {
      return;
    }

    this.#sortType = newSort;
    this.#updateFullList();
  }

  #renderSort = () => {
    render(this.#boardComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #openDetails = (film) => {
    if (this.#detailsComponent !== null) {
      this.#closeDetails();
    }

    const filmComments = this.comments.filter((comment) => film.comments.includes(comment.id));
    this.#detailsComponent = new FilmDetailsView(film, filmComments);

    bodyElement.classList.add('hide-overflow');
    render(bodyElement, this.#detailsComponent);

    this.#detailsComponent.setCloseDetailsHandler(this.#closeDetails);
    this.#detailsComponent.setControlClickHandler(this.#handleControlClick);
  }

  #closeDetails = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    remove(this.#detailsComponent);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeDetails();
    }
  }

  #handleFilmChange = (updatedFilm) => {
    const filmCard = this.#renderedCards.get(updatedFilm.id);

    if (filmCard) {
      filmCard.updateData(updatedFilm);
    }

    if (this.#detailsComponent !== null && this.#detailsComponent.filmData.id === updatedFilm.id) {
      this.#detailsComponent.updateData(updatedFilm);
    }

    this.#updateExtraLists();
  }

  #handleControlClick = (film, controlType) => {
    let updatedFilm = null;

    if (controlType === 'watchlist') {
      updatedFilm = {
        ...film,
        userDetails: {
          ...film.userDetails,
          watchlist: !film.userDetails.watchlist
        }
      };
    }

    if (controlType === 'watched') {
      updatedFilm = {
        ...film,
        userDetails: {
          ...film.userDetails,
          alreadyWatched: !film.userDetails.alreadyWatched,
          watchingDate: !film.userDetails.alreadyWatched ? new Date() : null
        }
      };
    }

    if (controlType === 'favorite') {
      updatedFilm = {
        ...film,
        userDetails: {
          ...film.userDetails,
          favorite: !film.userDetails.favorite
        }
      };
    }

    this.#handleFilmChange(updatedFilm);
  }

  #renderCard = (container, film) => {
    const cardComponent = new FilmCardView(film);
    render(container, cardComponent);

    cardComponent.setOpenDetailsHandler(() => {
      this.#openDetails(cardComponent.filmData);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    cardComponent.setControlClickHandler(this.#handleControlClick);

    return cardComponent;
  }

  #renderCards = (films) => {
    films.forEach((film) => {
      const filmCard = this.#renderCard(this.#filmsContainerComponent, film);
      this.#renderedCards.set(film.id, filmCard);
    });
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new FilmsListView('There are no movies in our database');
    render(this.#boardComponent, this.#noFilmsComponent);
  }

  #handleMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedCount = Math.min(filmsCount, this.#renderedCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedCount, newRenderedCount);

    this.#renderCards(films);
    this.#renderedCount = newRenderedCount;

    if (this.#renderedCount >= filmsCount) {
      remove(this.#moreButtonComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmsListComponent, this.#moreButtonComponent);
    this.#moreButtonComponent.setClickHandler(() => {
      this.#handleMoreButtonClick();
    });
  }

  #renderFullList = () => {
    const filmsCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmsCount, FILM_COUNT_PER_STEP));

    this.#filmsListComponent.element.querySelector('.films-list__title').classList.add('visually-hidden');
    render(this.#sortComponent, this.#filmsListComponent, RenderPosition.AFTEREND);
    render(this.#filmsListComponent, this.#filmsContainerComponent);

    this.#renderCards(films);

    if (filmsCount > FILM_COUNT_PER_STEP) {
      this.#renderMoreButton();
    }
  }

  #updateFullList = () => {
    this.#renderedCards.forEach((card) => remove(card));
    this.#renderedCards.clear();
    this.#renderedCount = FILM_COUNT_PER_STEP;

    remove(this.#moreButtonComponent);
    remove(this.#filmsListComponent);

    this.#renderFullList();
  }

  #renderTopFilms = () => {
    const topRatedFilms = getSortedFilms([...this.films], 'rating').slice(0, EXTRA_FILM_COUNT);

    this.#topFilmsComponent.element.classList.add('films-list--extra');
    render(this.#boardComponent, this.#topFilmsComponent);

    const containerComponent = new FilmsContainerView();
    render(this.#topFilmsComponent, containerComponent);

    topRatedFilms.forEach((film) => this.#renderCard(containerComponent, film));
  }

  #renderViralFilms = () => {
    const viralFilms = getSortedFilms([...this.films], 'comments').slice(0, EXTRA_FILM_COUNT);

    this.#viralFilmsComponent.element.classList.add('films-list--extra');
    render(this.#boardComponent, this.#viralFilmsComponent);

    const containerComponent = new FilmsContainerView();
    render(this.#viralFilmsComponent, containerComponent);

    viralFilms.forEach((film) => this.#renderCard(containerComponent, film));
  }

  #renderExtraLists = () => {
    if (this.films.some(({filmInfo}) => filmInfo.totalRating > 0)) {
      this.#renderTopFilms();
    }

    if (this.films.some(({comments}) => comments.length > 0)) {
      this.#renderViralFilms();
    }
  }

  #updateExtraLists = () => {
    remove(this.#topFilmsComponent);
    remove(this.#viralFilmsComponent);

    this.#renderExtraLists();
  }

  #renderBoard = () => {
    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFullList();
    this.#renderExtraLists();
  };
}
