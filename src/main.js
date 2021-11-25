import {createFilmCardTemplate} from './view/film-card-view';
import {createFilmDetailsTemplate} from './view/film-details-view';
import {createFilmsCounterTemplate} from './view/films-counter-view';
import {createFilmsListTemplate} from './view/films-list-view';
import {createMainNavigationTemplate} from './view/main-navigation-view';
import {createMoreButtonTemplate} from './view/more-button-view';
import {createProfileTemplate} from './view/profile-view';
import {createSortTemplate} from './view/sort-view';
import {renderTemplate, RenderPosition} from './render';
import {createFilmsTemplate} from './view/films-view';

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createProfileTemplate());
renderTemplate(siteMainElement, createMainNavigationTemplate());
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(footerStatisticsElement, createFilmsCounterTemplate());

renderTemplate(siteMainElement, createFilmsTemplate());

const filmsElement = siteMainElement.querySelector('.films');

const renderFilmCardsTemplate = (container, count) => {
  for (let i = 0; i < count; i++) {
    renderTemplate(container, createFilmCardTemplate());
  }
};

const renderSimpleFilmsListTemplate = (title) => {
  renderTemplate(filmsElement, createFilmsListTemplate());

  const listElement = filmsElement.querySelector('.films-list:last-of-type');
  const titleElement = listElement.querySelector('.films-list__title');
  const containerElement = listElement.querySelector('.films-list__container');

  titleElement.classList.add('visually-hidden');
  titleElement.innerHTML = title;

  renderFilmCardsTemplate(containerElement, FILM_COUNT);
  renderTemplate(listElement, createMoreButtonTemplate());
};

const renderExtraFilmsListTemplate = (title) => {
  renderTemplate(filmsElement, createFilmsListTemplate());

  const listElement = filmsElement.querySelector('.films-list:last-of-type');
  const titleElement = listElement.querySelector('.films-list__title');
  const containerElement = listElement.querySelector('.films-list__container');

  listElement.classList.add('films-list--extra');
  titleElement.innerHTML = title;

  renderFilmCardsTemplate(containerElement, EXTRA_FILM_COUNT);
};

renderSimpleFilmsListTemplate('All movies. Upcoming');
renderExtraFilmsListTemplate('Top rated');
renderExtraFilmsListTemplate('Most commented');

renderTemplate(footerStatisticsElement, createFilmDetailsTemplate(), RenderPosition.AFTEREND);

const filmDetailsElement = document.querySelector('.film-details');
filmDetailsElement.style.display = 'none';
