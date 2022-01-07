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
import CommentsModel from "../models/comments-model";

const bodyElement = document.body;
const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #boardContainer = null;
  #apiService = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #boardComponent = new FilmsView();
  #moreButtonComponent = new MoreButtonView();

  #filmsListComponent = new FilmsListView('All movies. Upcoming');
  #filmsContainerComponent = new FilmsContainerView();
  #topFilmsComponent = new FilmsListView('Top rated');
  #viralFilmsComponent = new FilmsListView('Most commented');
  #loadingComponent = new FilmsListView('Loading...');

  #detailsComponent = null;
  #noFilmsComponent = null;
  #sortComponent = null;

  #renderedCount = FILM_COUNT_PER_STEP;
  #renderedCards = new Map;

  #sortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(boardContainer, apiService, filmsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#apiService = apiService;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
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

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
    this.#renderExtraFilms();
  }

  destroy = () => {
    this.#clearBoard({resetRenderedCount: true, resetSortType: true});
    this.#clearExtraFilms();

    remove(this.#boardComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
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

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case ActionType.UPDATE_FILM:
        this.#filmsModel.update(updateType, update);
        break;
      case ActionType.ADD_COMMENT:
        this.#commentsModel.add(update);
        this.#filmsModel.addComment(updateType, update);
        break;
      case ActionType.DELETE_COMMENT:
        this.#commentsModel.delete(update);
        this.#filmsModel.deleteComment(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateCard(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        if (this.#detailsComponent !== null) {
          this.#updateDetails(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }

  #updateDetails = (updatedFilm) => {
    if (this.#detailsComponent.filmData.id === updatedFilm.id) {
      this.#detailsComponent.updateData({
        film: updatedFilm,
        comments: this.#commentsModel.getComments(updatedFilm.id)
      });
    }
  }

  #openDetails = async (film) => {
    if (this.#detailsComponent !== null) {
      this.#closeDetails();
    }

    this.#commentsModel = new CommentsModel(this.#apiService);
    let comments = [];
    try {
      comments = await this.#commentsModel.getComments(film.id);
    } catch (err) {
      comments = [];
    }

    this.#detailsComponent = new FilmDetailsView(film, comments);

    bodyElement.classList.add('hide-overflow');
    render(bodyElement, this.#detailsComponent);

    this.#detailsComponent.setCloseDetailsHandler(this.#closeDetails);
    this.#detailsComponent.setControlClickHandler(this.#handleControlClick);
    this.#detailsComponent.setDeleteCommentHandler(this.#deleteComment);
  }

  #closeDetails = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handleKeydown);
    remove(this.#detailsComponent);
  }

  #handleKeydown = (evt) => {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      this.#addComment();
      return;
    }

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

    if (this.#detailsComponent !== null) {
      this.#updateDetails(updatedFilm);
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

    this.#handleViewAction(ActionType.UPDATE_FILM, UpdateType.MINOR, updatedFilm);
  }

  #addComment = () => {
    const film = this.#detailsComponent.filmData;

    const comment = {
      id: this.comments[this.comments.length - 1].id + 1,
      comment: film.commentText,
      emotion: film.activeEmoji
    };

    if (comment.comment && comment.emotion) {
      this.#handleViewAction(ActionType.ADD_COMMENT, UpdateType.PATCH, {film, comment});
    }
  }

  #deleteComment = (id) => {
    this.#handleViewAction(ActionType.DELETE_COMMENT, UpdateType.PATCH, id);
  }

  #renderCard = (container, film) => {
    const cardComponent = new FilmCardView(film);
    render(container, cardComponent);

    cardComponent.setOpenDetailsHandler(() => {
      this.#openDetails(cardComponent.filmData);
      document.addEventListener('keydown', this.#handleKeydown);
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

  #renderLoading = () => {
    render(this.#boardComponent, this.#loadingComponent);
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
    remove(this.#loadingComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetSortType) {
      this.#sortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFullList();
  };
}
