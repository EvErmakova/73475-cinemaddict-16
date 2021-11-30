import {COMMENTS_COUNT, EXTRA_FILM_COUNT, FILMS_COUNT} from './services/constants';
import {getFilmsCount, getMostCommentedFilms, getTopRatedFilms} from './services/data';
import {renderElement} from './render';
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

const FILM_COUNT_PER_STEP = 5;

const filmsData = Array.from({length: FILMS_COUNT}, generateFilm);
const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);
const filters = generateFilter(filmsData);

const getFilmComments = ({comments}) => (
  commentsData.filter((item) => comments.includes(item.id))
);

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

const renderFilms = (title, count, films) => {
  const listElement = new FilmsListView().element;
  renderElement(filmsComponent.element, listElement);

  const titleElement = listElement.querySelector('.films-list__title');
  const containerElement = listElement.querySelector('.films-list__container');

  titleElement.innerHTML = title;

  for (let i = 0; i < count; i++) {
    renderElement(containerElement, new FilmCardView(films[i]).element);
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
