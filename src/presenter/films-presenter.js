import {ActionType, FilterType, NoTasksTextType, SortType, UpdateType} from '../const';
import {getSortedFilms} from '../utils/sorts';
import {filter} from '../utils/filters';
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
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #boardComponent = new FilmsView();
  #moreButtonComponent = new MoreButtonView();

  #filmsListComponent = new FilmsListView('All movies. Upcoming');
  #filmsContainerComponent = new FilmsContainerView();
  #topFilmsComponent = new FilmsListView('Top rated');
  #viralFilmsComponent = new FilmsListView('Most commented');

  #detailsComponent = null;
  #noFilmsComponent = null;
  #sortComponent = null;

  #renderedCount = FILM_COUNT_PER_STEP;
  #renderedCards = new Map;

  #sortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(boardContainer, filmsModel, commentsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    return this.#sortType === SortType.DEFAULT ? filteredFilms : getSortedFilms(filteredFilms, this.#sortType);
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    render(this.#boardContainer, this.#boardComponent);
    this.#renderBoard();
    this.#renderExtraFilms();
  }

  #handleSortTypeChange = (newSort) => {
    if (this.#sortType === newSort) {
      return;
    }

    this.#sortType = newSort;
    this.#clearBoard();
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#sortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#boardComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #handleViewAction = (actionType, update, updateType) => {
    switch (actionType) {
      case ActionType.UPDATE_FILM:
        this.#filmsModel.update(updateType, update);
        break;
      case ActionType.ADD_COMMENT:
        this.#commentsModel.add(update);
        break;
      case ActionType.DELETE_COMMENT:
        this.#commentsModel.delete(update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#updateCard(data);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  }

  #handleCommentModelEvent = (id) => {
    const film = this.films.find(({comments}) => comments.includes(id));
    const index = film.comments.findIndex((item) => item === id);
    const updatedFilm = {
      ...film,
      comments: [
        ...film.comments.slice(0, index),
        ...film.comments.slice(index + 1)
      ]
    };
    this.#handleViewAction(ActionType.UPDATE_FILM, updatedFilm, UpdateType.MINOR);
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
    this.#detailsComponent.setDeleteCommentHandler(this.#deleteComment);
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

  #updateCard = (updatedFilm) => {
    const filmCard = this.#renderedCards.get(updatedFilm.id);

    if (filmCard) {
      filmCard.updateData(updatedFilm);
    }

    if (this.#detailsComponent !== null && this.#detailsComponent.filmData.id === updatedFilm.id) {
      const filmComments = this.comments.filter((comment) => updatedFilm.comments.includes(comment.id));
      this.#detailsComponent.updateData({
        film: updatedFilm,
        comments: filmComments
      });
    }

    this.#clearExtraFilms();
    this.#renderExtraFilms();
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

    this.#handleViewAction(ActionType.UPDATE_FILM, updatedFilm, UpdateType.MINOR);
  }

  #deleteComment = (id) => {
    this.#handleViewAction(ActionType.DELETE_COMMENT, id);
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
    this.#noFilmsComponent = new FilmsListView(NoTasksTextType[this.#filterType]);
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
    const films = this.films.slice(0, Math.min(filmsCount, this.#renderedCount));

    this.#filmsListComponent.element.querySelector('.films-list__title').classList.add('visually-hidden');
    render(this.#boardComponent, this.#filmsListComponent, RenderPosition.AFTERBEGIN);
    render(this.#filmsListComponent, this.#filmsContainerComponent);

    this.#renderCards(films);

    if (filmsCount > this.#renderedCount) {
      this.#renderMoreButton();
    }
  }

  #renderExtraList = (component, films) => {
    component.element.classList.add('films-list--extra');
    render(this.#boardComponent, component);

    const containerComponent = new FilmsContainerView();
    render(component, containerComponent);

    films.forEach((film) => this.#renderCard(containerComponent, film));
  }

  #renderExtraFilms = () => {
    if (this.films.some(({filmInfo}) => filmInfo.totalRating > 0)) {
      this.#renderExtraList(this.#topFilmsComponent, this.#filmsModel.topFilms);
    }

    if (this.films.some(({comments}) => comments.length > 0)) {
      this.#renderExtraList(this.#viralFilmsComponent, this.#filmsModel.viralFilms);
    }
  }

  #clearExtraFilms = () => {
    remove(this.#topFilmsComponent);
    remove(this.#viralFilmsComponent);
  }

  #clearBoard = ({resetRenderedCount = false, resetSortType = false} = {}) => {
    this.#renderedCards.forEach((card) => remove(card));
    this.#renderedCards.clear();

    if (resetRenderedCount) {
      this.#renderedCount = FILM_COUNT_PER_STEP;
    }

    remove(this.#sortComponent);
    remove(this.#moreButtonComponent);
    remove(this.#filmsListComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetSortType) {
      this.#sortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderSort();
    this.#renderFullList();
  };
}
