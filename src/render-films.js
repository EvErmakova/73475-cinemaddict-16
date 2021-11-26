import {renderTemplate} from './render';
import {createFilmCardTemplate} from './view/film-card-view';
import {createFilmsListTemplate} from './view/films-list-view';
import {createMoreButtonTemplate} from './view/more-button-view';

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;

const getFilmsListElements = (container) => {
  const listElement = container.querySelector('.films-list:last-of-type');
  const titleElement = listElement.querySelector('.films-list__title');
  const containerElement = listElement.querySelector('.films-list__container');

  return {listElement, titleElement, containerElement};
};

const renderFilmsListTemplate = (container, title, count) => {
  renderTemplate(container, createFilmsListTemplate());
  const {titleElement, containerElement} = getFilmsListElements(container);

  titleElement.innerHTML = title;

  for (let i = 0; i < count; i++) {
    renderTemplate(containerElement, createFilmCardTemplate());
  }
};

export const renderSimpleFilmsListTemplate = (container, title) => {
  renderFilmsListTemplate(container, title, FILM_COUNT);
  const {listElement, titleElement} = getFilmsListElements(container);

  titleElement.classList.add('visually-hidden');
  renderTemplate(listElement, createMoreButtonTemplate());
};

export const renderExtraFilmsListTemplate = (container, title) => {
  renderFilmsListTemplate(container, title, EXTRA_FILM_COUNT);
  const {listElement} = getFilmsListElements(container);

  listElement.classList.add('films-list--extra');
};
