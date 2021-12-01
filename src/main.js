import {COMMENTS_COUNT, EXTRA_FILM_COUNT, FILMS_COUNT} from './services/constants';
import {getFilmsCount, getMostCommentedFilms, getTopRatedFilms} from './services/data';
import {RenderPosition, renderElement} from './render';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import {generateFilter} from './mock/filter';
import SortView from './view/sort-view';
import ProfileView from './view/profile-view';
import MainNavigationView from './view/main-navigation-view';
import FilmsCounterView from './view/films-counter-view';
import FilmsView from './view/films-view';
import FilmsListView from './view/films-list-view';
import FilmCardView from './view/film-card-view';
import MoreButtonView from './view/more-button-view';
import FilmDetailsView from './view/film-details-view';
import FilmComment from './view/film-comment';

const FILM_COUNT_PER_STEP = 5;

const filmsData = Array.from({length: FILMS_COUNT}, generateFilm);
const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);
const filters = generateFilter(filmsData);

const getFilmComments = ({comments}) => (
  commentsData.filter((item) => comments.includes(item.id))
);

const bodyElement = document.body;
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const alreadyWatchedCount = getFilmsCount(filmsData).alreadyWatched;

renderElement(siteHeaderElement, new ProfileView(alreadyWatchedCount).element);
renderElement(siteMainElement, new MainNavigationView(filters).element);
renderElement(siteMainElement, new SortView().element);
renderElement(footerStatisticsElement, new FilmsCounterView(filmsData.length).element);

const filmsComponent = new FilmsView();
renderElement(siteMainElement, filmsComponent.element);

const renderFilm = (container, film) => {
  const filmCardElement = new FilmCardView(film).element;
  const filmDetailsElement = new FilmDetailsView(film).element;

  const openFilmDetails = () => {
    bodyElement.classList.add('hide-overflow');
    bodyElement.appendChild(filmDetailsElement);

    const commentsListElement = filmDetailsElement.querySelector('.film-details__comments-list');
    for (let i = 0; i < film.comments.length; i++) {
      const comment = getFilmComments(film)[i];
      renderElement(commentsListElement, new FilmComment(comment).element);
    }
  };

  const closeFilmDetails = () => {
    bodyElement.classList.remove('hide-overflow');
    bodyElement.removeChild(filmDetailsElement);
  };

  renderElement(container, filmCardElement);

  const filmCardLinkElement = filmCardElement.querySelector('.film-card__link');
  filmCardLinkElement.addEventListener('click', () => openFilmDetails());

  const filmDetailsCloseButton = filmDetailsElement.querySelector('.film-details__close-btn');
  filmDetailsCloseButton.addEventListener('click', () => closeFilmDetails());
};

const renderFilms = (title, count, films) => {
  const listElement = new FilmsListView().element;
  renderElement(filmsComponent.element, listElement);

  const titleElement = listElement.querySelector('.films-list__title');
  const containerElement = listElement.querySelector('.films-list__container');

  titleElement.innerHTML = title;

  for (let i = 0; i < count; i++) {
    const film = films[i];
    renderFilm(containerElement, film);
  }

  return {listElement, titleElement, containerElement};
};

const {
  titleElement: simpleFilmsTitleElement,
  listElement: simpleFilmsListElement,
  containerElement: simpleFilmsContainerElement
} = renderFilms('All movies. Upcoming', Math.min(filmsData.length, FILM_COUNT_PER_STEP), filmsData);

simpleFilmsTitleElement.classList.add('visually-hidden');

if (filmsData.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const moreButtonComponent = new MoreButtonView();
  renderElement(simpleFilmsListElement, moreButtonComponent.element);

  moreButtonComponent.element.addEventListener('click', (event) => {
    event.preventDefault();
    filmsData
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderElement(simpleFilmsContainerElement, new FilmCardView(film).element));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= filmsData.length) {
      moreButtonComponent.element.remove();
      moreButtonComponent.removeElement();
    }
  });
}

const {
  listElement: topFilmsListElement
} = renderFilms('Top rated', EXTRA_FILM_COUNT, getTopRatedFilms(filmsData));
topFilmsListElement.classList.add('films-list--extra');

const {
  listElement: mostCommentedFilmsListElement
} = renderFilms('Most commented', EXTRA_FILM_COUNT, getMostCommentedFilms(filmsData));
mostCommentedFilmsListElement.classList.add('films-list--extra');
