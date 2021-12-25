import {COMMENTS_COUNT, FILMS_COUNT} from './const';
import {getFilmsCount} from './utils/film';
import {render} from './utils/render';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import {generateFilter} from './mock/filter';
import FilmsModel from './models/films-model';
import CommentsModel from './models/comments-model';
import ProfileView from './view/profile-view';
import MainNavigationView from './view/main-navigation-view';
import FilmsCounterView from './view/films-counter-view';
import FilmsPresenter from './presenter/films-presenter';

const films = Array.from({length: FILMS_COUNT}, generateFilm);
const comments = Array.from({length: COMMENTS_COUNT}, generateComment);
const filters = generateFilter(films);
const alreadyWatchedCount = getFilmsCount(films).alreadyWatched;

const filmsModel = new FilmsModel();
filmsModel.films = films;

const commentsModel = new CommentsModel();
commentsModel.comments = comments;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);

render(siteMainElement, new MainNavigationView(filters));
render(siteHeaderElement, new ProfileView(alreadyWatchedCount));
filmsPresenter.init();
render(footerStatisticsElement, new FilmsCounterView(films.length));
