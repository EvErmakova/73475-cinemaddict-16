import {createFilmCardTemplate} from './view/film-card-view';
import {createFilmDetailsTemplate} from './view/film-details-view';
import {createFilmsCounterTemplate} from './view/films-counter-view';
import {createFilmsListTemplate} from './view/films-list-view';
import {createMainNavigationTemplate} from './view/main-navigation-view';
import {createMoreButtonTemplate} from './view/more-button-view';
import {createProfileTemplate} from './view/profile-view';
import {createSortTemplate} from './view/sort-view';
import {renderTemplate, RenderPosition} from './render.js';

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createMainNavigationTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(footerStatisticsElement, createFilmsCounterTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainElement, '<section class="films"></section>', RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');

const renderFilmsListTemplate = (title, extra) => {
  renderTemplate(filmsElement, createFilmsListTemplate(), RenderPosition.BEFOREEND);

  const listElement = filmsElement.querySelector('.films-list:last-of-type');
  const titleElement = listElement.querySelector('.films-list__title');
  const containerElement = listElement.querySelector('.films-list__container');

  let filmsCount = FILM_COUNT;

  titleElement.innerHTML = title;

  switch (extra) {
    case true:
      listElement.classList.add('films-list--extra');
      filmsCount = EXTRA_FILM_COUNT;
      break;

    default:
      titleElement.classList.add('visually-hidden');
      renderTemplate(listElement, createMoreButtonTemplate(), RenderPosition.BEFOREEND);
      break;
  }

  for (let i = 0; i < filmsCount; i++) {
    renderTemplate(containerElement, createFilmCardTemplate(), RenderPosition.AFTERBEGIN);
  }  
};

renderFilmsListTemplate('All movies. Upcoming');
renderFilmsListTemplate('Top rated', true);
renderFilmsListTemplate('Most commented', true);
