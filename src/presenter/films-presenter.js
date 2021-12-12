import {EXTRA_FILM_COUNT} from '../const';
import {remove, render, RenderPosition} from '../utils/render';
import FilmsView from '../view/films-view';
import SortView from '../view/sort-view';
import MoreButtonView from '../view/more-button-view';
import FilmsListView from '../view/films-list-view';
import FilmsContainerView from '../view/films-container-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';
import FilmCommentView from '../view/film-comment-view';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsContainer = null;

  #filmsComponent = new FilmsView();
  #sortComponent = new SortView();
  #moreButtonComponent = new MoreButtonView();

  #noFilmsComponent = null;
  #fullFilmsComponent = null;
  #topFilmsComponent = null;
  #mostCommentedFilmsComponent = null;

  #films = [];
  #topRatedFilms = [];
  #mostCommentedFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(filmsListContainer) {
    this.#filmsContainer = filmsListContainer;
  }

  init = (films) => {
    this.#films = [...films];

    render(this.#filmsContainer, this.#filmsComponent);
    this.#renderFilms();
  }

  #renderSort = () => {
    render(this.#filmsComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderFilm = (container, film) => {
    const filmCardComponent = new FilmCardView(film);

    render(container, filmCardComponent);
  }

  #renderFilmsCards = (container, films, from, to) => {
    films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(container, film));
  }

  #renderFilmsList = (container, films, count = films.length) => {
    const filmsContainerComponent = new FilmsContainerView();
    render(this.#filmsComponent, container);
    render(container, filmsContainerComponent);

    this.#renderFilmsCards(filmsContainerComponent, films, 0, count);
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new FilmsListView('There are no movies in our database');
    render(this.#filmsComponent, this.#noFilmsComponent);
  }

  #handleMoreButtonClick = () => {
    this.#renderFilmsCards(
      this.#fullFilmsComponent.element.querySelector('.films-list__container'),
      this.#films,
      this.#renderedFilmCount,
      this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#moreButtonComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#fullFilmsComponent, this.#moreButtonComponent);
    this.#moreButtonComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #renderFullFilmsList = () => {
    this.#fullFilmsComponent = new FilmsListView('All movies. Upcoming');
    this.#fullFilmsComponent.element.querySelector('.films-list__title').classList.add('visually-hidden');

    this.#renderFilmsList(
      this.#fullFilmsComponent,
      this.#films,
      Math.min(this.#films.length, FILM_COUNT_PER_STEP)
    );

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderMoreButton();
    }
  }

  #renderTopFilmsList = () => {
    this.#topRatedFilms = this.#films
      .sort((current, next) => next.filmInfo.totalRating - current.filmInfo.totalRating)
      .slice(0, EXTRA_FILM_COUNT);

    this.#topFilmsComponent = new FilmsListView('Top rated');
    this.#topFilmsComponent.element.classList.add('films-list--extra');

    this.#renderFilmsList(this.#topFilmsComponent, this.#topRatedFilms);
  }

  #renderMostCommentedFilmsList = () => {
    this.#mostCommentedFilms = this.#films
      .sort((current, next) => next.comments.length - current.comments.length)
      .slice(0, EXTRA_FILM_COUNT);

    this.#mostCommentedFilmsComponent = new FilmsListView('Most commented');
    this.#mostCommentedFilmsComponent.element.classList.add('films-list--extra');

    this.#renderFilmsList(this.#mostCommentedFilmsComponent, this.#mostCommentedFilms);
  }

  #renderFilms = () => {
    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFullFilmsList();

    if (this.#films.some(({filmInfo}) => filmInfo.totalRating > 0)) {
      this.#renderTopFilmsList();
    }

    if (this.#films.some(({comments}) => comments.length > 0)) {
      this.#renderMostCommentedFilmsList();
    }
  };
}
