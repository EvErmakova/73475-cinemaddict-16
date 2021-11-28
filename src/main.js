import {createFilmDetailsTemplate} from './view/film-details-view';
import {createFilmsCounterTemplate} from './view/films-counter-view';
import {createMainNavigationTemplate} from './view/main-navigation-view';
import {createProfileTemplate} from './view/profile-view';
import {createSortTemplate} from './view/sort-view';
import {renderTemplate, RenderPosition} from './render';
import {createFilmsTemplate} from './view/films-view';
import {createFilmsListTemplate} from './view/films-list-view';
import {createFilmCardTemplate} from './view/film-card-view';
import {createMoreButtonTemplate} from './view/more-button-view';
import {generateFilm} from './mock/film';
import {COMMENTS_COUNT, FILMS_COUNT} from './services/constants';
import {generateComment} from './mock/comment';
import {generateFilter} from './mock/filter';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

const allFilms = Array.from({length: FILMS_COUNT}, generateFilm);
const topRatedFilms = Array.from({length: EXTRA_FILM_COUNT}, generateFilm);
const mostCommentedFilms = Array.from({length: EXTRA_FILM_COUNT}, generateFilm);

const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);

const filters = generateFilter(allFilms);
const alreadyWatchedCount = filters.find((item) => item.name === 'history').count;

const getFilmComments = ({comments}) => (
  commentsData.filter((item) => comments.includes(item.id))
);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createProfileTemplate(alreadyWatchedCount));
renderTemplate(siteMainElement, createMainNavigationTemplate(filters));
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(footerStatisticsElement, createFilmsCounterTemplate(allFilms.length));

renderTemplate(siteMainElement, createFilmsTemplate());

const filmsElement = siteMainElement.querySelector('.films');

const renderFilms = (title, count, films) => {
  renderTemplate(filmsElement, createFilmsListTemplate());

  const listElement = filmsElement.querySelector('.films-list:last-of-type');
  const titleElement = listElement.querySelector('.films-list__title');
  const containerElement = listElement.querySelector('.films-list__container');

  titleElement.innerHTML = title;

  for (let i = 0; i < count; i++) {
    renderTemplate(containerElement, createFilmCardTemplate(films[i]));
  }

  return {listElement, titleElement, containerElement};
};

const {
  titleElement: simpleFilmsTitleElement,
  listElement: simpleFilmsListElement,
  containerElement: simpleFilmsContainerElement
} = renderFilms('All movies. Upcoming', Math.min(allFilms.length, FILM_COUNT_PER_STEP), allFilms);

simpleFilmsTitleElement.classList.add('visually-hidden');

if (allFilms.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  renderTemplate(simpleFilmsListElement, createMoreButtonTemplate());

  const loadMoreButton = simpleFilmsListElement.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (event) => {
    event.preventDefault();
    allFilms
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(simpleFilmsContainerElement, createFilmCardTemplate(film)));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= allFilms.length) {
      loadMoreButton.remove();
    }
  });
}

const {
  listElement: topFilmsListElement
} = renderFilms('Top rated', EXTRA_FILM_COUNT, topRatedFilms);
topFilmsListElement.classList.add('films-list--extra');

const {
  listElement: mostCommentedFilmsListElement
} = renderFilms('Most commented', EXTRA_FILM_COUNT, mostCommentedFilms);
mostCommentedFilmsListElement.classList.add('films-list--extra');

renderTemplate(footerStatisticsElement, createFilmDetailsTemplate(allFilms[0], getFilmComments(allFilms[0])), RenderPosition.AFTEREND);

const filmDetailsElement = document.querySelector('.film-details');
filmDetailsElement.style.display = 'none';
