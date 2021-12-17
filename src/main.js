import {COMMENTS_COUNT, FILMS_COUNT} from './const';
import {getFilmsCount} from './utils/film';
import {render} from './utils/render';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import {generateFilter} from './mock/filter';
import ProfileView from './view/profile-view';
import MainNavigationView from './view/main-navigation-view';
import FilmsCounterView from './view/films-counter-view';
import FilmsPresenter from './presenter/films-presenter';

const filmsData = Array.from({length: FILMS_COUNT}, generateFilm);
const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);
const filters = generateFilter(filmsData);
const alreadyWatchedCount = getFilmsCount(filmsData).alreadyWatched;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const filmsPresenter = new FilmsPresenter(siteMainElement);

render(siteMainElement, new MainNavigationView(filters));
render(siteHeaderElement, new ProfileView(alreadyWatchedCount));
filmsPresenter.init(filmsData, commentsData);
render(footerStatisticsElement, new FilmsCounterView(filmsData.length));
