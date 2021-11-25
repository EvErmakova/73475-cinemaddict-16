import {createFilmDetailsTemplate} from './view/film-details-view';
import {createFilmsCounterTemplate} from './view/films-counter-view';
import {createMainNavigationTemplate} from './view/main-navigation-view';
import {createProfileTemplate} from './view/profile-view';
import {createSortTemplate} from './view/sort-view';
import {renderTemplate, RenderPosition} from './render';
import {createFilmsTemplate} from './view/films-view';
import {renderExtraFilmsListTemplate, renderSimpleFilmsListTemplate} from './render-films';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createProfileTemplate());
renderTemplate(siteMainElement, createMainNavigationTemplate());
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(footerStatisticsElement, createFilmsCounterTemplate());

renderTemplate(siteMainElement, createFilmsTemplate());

const filmsElement = siteMainElement.querySelector('.films');

renderSimpleFilmsListTemplate(filmsElement, 'All movies. Upcoming');
renderExtraFilmsListTemplate(filmsElement, 'Top rated');
renderExtraFilmsListTemplate(filmsElement, 'Most commented');

renderTemplate(footerStatisticsElement, createFilmDetailsTemplate(), RenderPosition.AFTEREND);

const filmDetailsElement = document.querySelector('.film-details');
filmDetailsElement.style.display = 'none';
