import {COMMENTS_COUNT, FILMS_COUNT} from './const';
import {filter} from './utils/filters';
import {render} from './utils/render';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import FilmsModel from './models/films-model';
import CommentsModel from './models/comments-model';
import FilterModel from './models/filter-model';
import ProfileView from './view/profile-view';
import FilmsCounterView from './view/films-counter-view';
import FilmsPresenter from './presenter/films-presenter';
import FilterPresenter from './presenter/filter-presenter';

const films = Array.from({length: FILMS_COUNT}, generateFilm);
const comments = Array.from({length: COMMENTS_COUNT}, generateComment);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const commentsModel = new CommentsModel();
commentsModel.comments = comments;

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);
const filtersPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(siteHeaderElement, new ProfileView(filter.history.length));
filtersPresenter.init();
filmsPresenter.init();
render(footerStatisticsElement, new FilmsCounterView(films.length));
