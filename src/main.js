import {COMMENTS_COUNT, FILMS_COUNT, ScreenType} from './const';
import {remove, render} from './utils/render';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import FilmsModel from './models/films-model';
import CommentsModel from './models/comments-model';
import FilterModel from './models/filter-model';
import ProfileView from './view/profile-view';
import StatsView from './view/stats-view';
import FilmsCounterView from './view/films-counter-view';
import FilmsPresenter from './presenter/films-presenter';
import NavigationPresenter from './presenter/navigation-presenter';
import StatsPresenter from "./presenter/stats-presenter";

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

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const statsPresenter = new StatsPresenter(siteMainElement, filmsModel);

const handleNavigationClick = (screenType) => {
  console.log('change screen');
  if (screenType === ScreenType.STATS) {
    filmsPresenter.destroy();
    statsPresenter.init();
    return;
  }

  statsPresenter.destroy();
  filmsPresenter.init();
};

const navigationPresenter = new NavigationPresenter(siteMainElement, filterModel, filmsModel, handleNavigationClick);

render(siteHeaderElement, new ProfileView(filmsModel));
navigationPresenter.init();
filmsPresenter.init();
render(footerStatisticsElement, new FilmsCounterView(films.length));
