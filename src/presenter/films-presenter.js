import {EXTRA_FILM_COUNT} from '../const';
import {updateItem} from '../utils/common';
import {remove, render, RenderPosition} from '../utils/render';
import FilmsView from '../view/films-view';
import SortView from '../view/sort-view';
import MoreButtonView from '../view/more-button-view';
import FilmsListView from '../view/films-list-view';
import FilmsContainerView from '../view/films-container-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';
import FilmCommentView from '../view/film-comment-view';

const bodyElement = document.body;
const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;

  #filmsComponent = new FilmsView();
  #sortComponent = new SortView();
  #moreButtonComponent = new MoreButtonView();

  #noFilmsComponent = null;
  #fullFilmsComponent = new FilmsListView('All movies. Upcoming');
  #fullFilmsContainerComponent = new FilmsContainerView();
  #topFilmsComponent = new FilmsListView('Top rated');
  #mostCommentedFilmsComponent = new FilmsListView('Most commented');
  #filmDetailsComponent = null;

  #films = [];
  #topRatedFilms = [];
  #mostCommentedFilms = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #renderedFilmCards = new Map;

  constructor(filmsListContainer) {
    this.#filmsContainer = filmsListContainer;
  }

  init = (films, comments) => {
    this.#films = [...films];
    this.#comments = [...comments];

    render(this.#filmsContainer, this.#filmsComponent);
    this.#renderFilms();
  }

  #renderSort = () => {
    render(this.#filmsComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderFilmComments = (film) => {
    const filmComments = this.#comments.filter((item) => film.comments.includes(item.id));
    const commentsListElement = this.#filmDetailsComponent.element.querySelector('.film-details__comments-list');

    for (let i = 0; i < film.comments.length; i++) {
      render(commentsListElement, new FilmCommentView(filmComments[i]));
    }
  }

  #openFilmDetails = (film) => {
    if (this.#filmDetailsComponent !== null) {
      this.#closeFilmDetails();
    }

    this.#filmDetailsComponent = new FilmDetailsView(film);

    bodyElement.classList.add('hide-overflow');
    render(bodyElement, this.#filmDetailsComponent);
    this.#renderFilmComments(film);

    this.#filmDetailsComponent.setCloseDetailsHandler(this.#closeFilmDetails);
    this.#filmDetailsComponent.setControlClickHandler(this.#handleControlClick);
  }

  #closeFilmDetails = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    remove(this.#filmDetailsComponent);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeFilmDetails();
    }
  }

  #handleFilmChange = (updatedFilm, controlType) => {
    this.#films = updateItem(this.#films, updatedFilm);
    const filmCard = this.#renderedFilmCards.get(updatedFilm.id);

    if (filmCard) {
      filmCard.filmData = updatedFilm;
      filmCard.updateControl(controlType);
    }

    if (this.#filmDetailsComponent !== null && this.#filmDetailsComponent.filmData.id === updatedFilm.id) {
      this.#filmDetailsComponent.filmData = updatedFilm;
      this.#filmDetailsComponent.updateControl(controlType);
    }

    this.#updateExtraFilmsLists();
  }

  #handleControlClick = (film, controlType) => {
    let updatedFilm = null;

    if (controlType === 'watchlist') {
      updatedFilm = {
        ...film,
        userDetails: {...film.userDetails, watchlist: !film.userDetails.watchlist}
      };
    } else if (controlType === 'watched') {
      updatedFilm = {
        ...film,
        userDetails: {...film.userDetails, alreadyWatched: !film.userDetails.alreadyWatched, watchingDate: new Date()}
      };
    } else if (controlType === 'favorite') {
      updatedFilm = {
        ...film,
        userDetails: {...film.userDetails, favorite: !film.userDetails.favorite}
      };
    }

    this.#handleFilmChange(updatedFilm, controlType);
  }

  #renderFilm = (container, film) => {
    const filmCardComponent = new FilmCardView(film);
    render(container, filmCardComponent);

    filmCardComponent.setOpenDetailsHandler(() => {
      this.#openFilmDetails(filmCardComponent.filmData);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    filmCardComponent.setControlClickHandler(this.#handleControlClick);

    return filmCardComponent;
  }

  #renderFilmsCards = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => {
        const filmCard = this.#renderFilm(this.#fullFilmsContainerComponent, film);
        this.#renderedFilmCards.set(film.id, filmCard);
      });
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new FilmsListView('There are no movies in our database');
    render(this.#filmsComponent, this.#noFilmsComponent);
  }

  #handleMoreButtonClick = () => {
    this.#renderFilmsCards(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#moreButtonComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#fullFilmsContainerComponent, this.#moreButtonComponent, RenderPosition.AFTEREND);
    this.#moreButtonComponent.setClickHandler(() => {
      this.#handleMoreButtonClick();
    });
  }

  #renderFullFilmsList = () => {
    this.#fullFilmsComponent.element.querySelector('.films-list__title').classList.add('visually-hidden');

    render(this.#sortComponent, this.#fullFilmsComponent, RenderPosition.AFTEREND);
    render(this.#fullFilmsComponent, this.#fullFilmsContainerComponent);

    this.#renderFilmsCards(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderMoreButton();
    }
  }

  #renderExtraFilmsList = (container, films) => {
    const filmsContainerComponent = new FilmsContainerView();
    container.element.classList.add('films-list--extra');

    render(this.#filmsComponent, container);
    render(container, filmsContainerComponent);

    films.forEach((film) => this.#renderFilm(filmsContainerComponent, film));
  }

  #renderExtraFilmsLists = () => {
    if (this.#films.some(({filmInfo}) => filmInfo.totalRating > 0)) {
      this.#topRatedFilms = [...this.#films]
        .sort((current, next) => next.filmInfo.totalRating - current.filmInfo.totalRating)
        .slice(0, EXTRA_FILM_COUNT);
      this.#renderExtraFilmsList(this.#topFilmsComponent, this.#topRatedFilms);
    }

    if (this.#films.some(({comments}) => comments.length > 0)) {
      this.#mostCommentedFilms = [...this.#films]
        .sort((current, next) => next.comments.length - current.comments.length)
        .slice(0, EXTRA_FILM_COUNT);
      this.#renderExtraFilmsList(this.#mostCommentedFilmsComponent, this.#mostCommentedFilms);
    }
  }

  #updateExtraFilmsLists = () => {
    remove(this.#topFilmsComponent);
    remove(this.#mostCommentedFilmsComponent);

    this.#renderExtraFilmsLists();
  }

  #renderFilms = () => {
    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFullFilmsList();
    this.#renderExtraFilmsLists();
  };
}
