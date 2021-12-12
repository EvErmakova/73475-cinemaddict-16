import FilmsView from '../view/films-view';
import FilmsListView from '../view/films-list-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsView from '../view/film-details-view';
import NoFilmsView from '../view/no-films-view';
import SortView from '../view/sort-view';
import MoreButtonView from '../view/more-button-view';
import {render} from '../utils/render';

export default class FilmsPresenter {
  #filmsContainer = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmCardComponent = new FilmCardView();
  #filmDetailsComponent = new FilmDetailsView();
  #noFilmsComponent = new NoFilmsView();
  #sortComponent = new SortView();
  #moreButtonComponent = new MoreButtonView();

  #films = [];

  constructor(filmsListContainer) {
    this.#filmsContainer = filmsListContainer;
  }

  init = (films) => {
    this.#films = [...films];

    render(this.#filmsContainer, this.#filmsComponent);
    this.#renderFilms();
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

  #renderNoFilms = () => {
    render(this.#filmsComponent, this.#noFilmsComponent);
  }

  #renderSort = () => {
    render(this.#filmsComponent, this.#sortComponent);
  }

  #renderFullFilmsList = () => {

  }

  #renderMoreButton = () => {

  }

  #renderTopFilmsList = () => {

  }

  #renderMostCommentedFilmsList = () => {

  }

  #renderFilmsList = () => {

  }

  #renderFilm = () => {

  }
}
