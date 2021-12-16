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

  #boardComponent = new FilmsView();
  #sortComponent = new SortView();
  #moreButtonComponent = new MoreButtonView();

  #noFilmsComponent = null;
  #filmsListComponent = new FilmsListView('All movies. Upcoming');
  #filmsContainerComponent = new FilmsContainerView();
  #topFilmsComponent = new FilmsListView('Top rated');
  #mostCommentedFilmsComponent = new FilmsListView('Most commented');
  #filmDetailsComponent = null;

  #films = [];
  #comments = [];
  #renderedFilmsCount = FILM_COUNT_PER_STEP;
  #renderedFilms = new Map;

  constructor(filmsListContainer) {
    this.#filmsContainer = filmsListContainer;
  }

  init = (films, comments) => {
    this.#films = [...films];
    this.#comments = [...comments];

    render(this.#filmsContainer, this.#boardComponent);
    this.#renderBoard();
  }

  #renderSort = () => {
    render(this.#boardComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderComments = (film) => {
    const filmComments = this.#comments.filter((item) => film.comments.includes(item.id));
    const commentsListElement = this.#filmDetailsComponent.element.querySelector('.film-details__comments-list');

    for (let i = 0; i < film.comments.length; i++) {
      render(commentsListElement, new FilmCommentView(filmComments[i]));
    }
  }

  #openDetails = (film) => {
    if (this.#filmDetailsComponent !== null) {
      this.#closeDetails();
    }

    this.#filmDetailsComponent = new FilmDetailsView(film);

    bodyElement.classList.add('hide-overflow');
    render(bodyElement, this.#filmDetailsComponent);
    this.#renderComments(film);

    this.#filmDetailsComponent.setCloseDetailsHandler(this.#closeDetails);
    this.#filmDetailsComponent.setControlClickHandler(this.#handleControlClick);
  }

  #closeDetails = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    remove(this.#filmDetailsComponent);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeDetails();
    }
  }

  #handleFilmChange = (updatedFilm, controlType) => {
    this.#films = updateItem(this.#films, updatedFilm);
    const filmCard = this.#renderedFilms.get(updatedFilm.id);

    if (filmCard) {
      filmCard.filmData = updatedFilm;
      filmCard.updateControl(controlType);
    }

    if (this.#filmDetailsComponent !== null && this.#filmDetailsComponent.filmData.id === updatedFilm.id) {
      this.#filmDetailsComponent.filmData = updatedFilm;
      this.#filmDetailsComponent.updateControl(controlType);
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
          watchingDate: new Date()
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

    this.#handleFilmChange(updatedFilm, controlType);
  }

  #renderFilm = (container, film) => {
    const cardComponent = new FilmCardView(film);
    render(container, cardComponent);

    cardComponent.setOpenDetailsHandler(() => {
      this.#openDetails(cardComponent.filmData);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    cardComponent.setControlClickHandler(this.#handleControlClick);

    return cardComponent;
  }

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => {
        const filmCard = this.#renderFilm(this.#filmsContainerComponent, film);
        this.#renderedFilms.set(film.id, filmCard);
      });
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new FilmsListView('There are no movies in our database');
    render(this.#boardComponent, this.#noFilmsComponent);
  }

  #handleMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmsCount, this.#renderedFilmsCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmsCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      remove(this.#moreButtonComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmsContainerComponent, this.#moreButtonComponent, RenderPosition.AFTEREND);
    this.#moreButtonComponent.setClickHandler(() => {
      this.#handleMoreButtonClick();
    });
  }

  #renderFullList = () => {
    this.#filmsListComponent.element.querySelector('.films-list__title').classList.add('visually-hidden');

    render(this.#sortComponent, this.#filmsListComponent, RenderPosition.AFTEREND);
    render(this.#filmsListComponent, this.#filmsContainerComponent);

    this.#renderFilms(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderMoreButton();
    }
  }

  #renderTopFilms = () => {
    const topRatedFilms = [...this.#films]
      .sort((current, next) => next.filmInfo.totalRating - current.filmInfo.totalRating)
      .slice(0, EXTRA_FILM_COUNT);

    this.#topFilmsComponent.element.classList.add('films-list--extra');
    render(this.#boardComponent, this.#topFilmsComponent);

    const filmsContainerComponent = new FilmsContainerView();
    render(this.#topFilmsComponent, filmsContainerComponent);

    topRatedFilms.forEach((film) => this.#renderFilm(filmsContainerComponent, film));
  }

  #renderMostCommentedFilms = () => {
    const mostCommentedFilms = [...this.#films]
      .sort((current, next) => next.comments.length - current.comments.length)
      .slice(0, EXTRA_FILM_COUNT);

    this.#mostCommentedFilmsComponent.element.classList.add('films-list--extra');
    render(this.#boardComponent, this.#mostCommentedFilmsComponent);

    const filmsContainerComponent = new FilmsContainerView();
    render(this.#mostCommentedFilmsComponent, filmsContainerComponent);

    mostCommentedFilms.forEach((film) => this.#renderFilm(filmsContainerComponent, film));
  }

  #renderExtraLists = () => {
    if (this.#films.some(({filmInfo}) => filmInfo.totalRating > 0)) {
      this.#renderTopFilms();
    }

    if (this.#films.some(({comments}) => comments.length > 0)) {
      this.#renderMostCommentedFilms();
    }
  }

  #updateExtraLists = () => {
    remove(this.#topFilmsComponent);
    remove(this.#mostCommentedFilmsComponent);

    this.#renderExtraLists();
  }

  #renderBoard = () => {
    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFullList();
    this.#renderExtraLists();
  };
}
