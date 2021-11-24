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
