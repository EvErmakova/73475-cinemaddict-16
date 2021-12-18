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
import FilmCommentView from '../view/film-comment-view';

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

  #films = [];
  #comments = [];
  #renderedCount = FILM_COUNT_PER_STEP;
  #renderedCards = new Map;

  #sortType = 'default';
  #origFilms = [];

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (films, comments) => {
    this.#films = [...films];
    this.#comments = [...comments];
    this.#origFilms = [...films];

    render(this.#boardContainer, this.#boardComponent);
    this.#renderBoard();
  }

  #sort = (newSort) => {
    if (newSort === 'default') {
      this.#films = [...this.#origFilms];
    } else {
      this.#films = getSortedFilms(this.#films, newSort);
    }

    this.#sortType = newSort;
  }

  #handleSortTypeChange = (newSort) => {
    if (newSort === this.#sortType) {
      return;
    }

    this.#sort(newSort);
    this.#updateFullList();
  }

  #renderSort = () => {
    render(this.#boardComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderComments = (film) => {
    const commentsNode = this.#detailsComponent.element.querySelector('.film-details__comments-list');
    this.#comments.forEach((c) => {
      if (film.comments.includes(c.id)) {
        render(commentsNode, new FilmCommentView(c));
      }
    });
  }

  #openDetails = (film) => {
    if (this.#detailsComponent !== null) {
      this.#closeDetails();
    }

    this.#detailsComponent = new FilmDetailsView(film);

    bodyElement.classList.add('hide-overflow');
    render(bodyElement, this.#detailsComponent);
    this.#renderComments(film);

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

  #handleFilmChange = (updatedFilm, controlType) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#origFilms = updateItem(this.#origFilms, updatedFilm);
    const filmCard = this.#renderedCards.get(updatedFilm.id);

    if (filmCard) {
      filmCard.filmData = updatedFilm;
      filmCard.updateControl(controlType);
    }

    if (this.#detailsComponent !== null && this.#detailsComponent.filmData.id === updatedFilm.id) {
      this.#detailsComponent.filmData = updatedFilm;
      this.#detailsComponent.updateControl(controlType);
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

  #renderCards = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => {
        const filmCard = this.#renderCard(this.#filmsContainerComponent, film);
        this.#renderedCards.set(film.id, filmCard);
      });
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new FilmsListView('There are no movies in our database');
    render(this.#boardComponent, this.#noFilmsComponent);
  }

  #handleMoreButtonClick = () => {
    this.#renderCards(this.#renderedCount, this.#renderedCount + FILM_COUNT_PER_STEP);
    this.#renderedCount += FILM_COUNT_PER_STEP;

    if (this.#renderedCount >= this.#films.length) {
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

    this.#renderCards(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
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
    const topRatedFilms = getSortedFilms([...this.#origFilms], 'rating')
      .slice(0, EXTRA_FILM_COUNT);

    this.#topFilmsComponent.element.classList.add('films-list--extra');
    render(this.#boardComponent, this.#topFilmsComponent);

    const containerComponent = new FilmsContainerView();
    render(this.#topFilmsComponent, containerComponent);

    topRatedFilms.forEach((film) => this.#renderCard(containerComponent, film));
  }

  #renderViralFilms = () => {
    const viralFilms = getSortedFilms([...this.#films], 'comments')
      .slice(0, EXTRA_FILM_COUNT);

    this.#viralFilmsComponent.element.classList.add('films-list--extra');
    render(this.#boardComponent, this.#viralFilmsComponent);

    const containerComponent = new FilmsContainerView();
    render(this.#viralFilmsComponent, containerComponent);

    viralFilms.forEach((film) => this.#renderCard(containerComponent, film));
  }

  #renderExtraLists = () => {
    if (this.#films.some(({filmInfo}) => filmInfo.totalRating > 0)) {
      this.#renderTopFilms();
    }

    if (this.#films.some(({comments}) => comments.length > 0)) {
      this.#renderViralFilms();
    }
  }

  #updateExtraLists = () => {
    remove(this.#topFilmsComponent);
    remove(this.#viralFilmsComponent);

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
