import {API_AUTHORIZATION, API_URL, ScreenType} from './const';
import {render} from './utils/render';
import ApiService from './api-service';
import FilmsModel from './models/films-model';
import CommentsModel from './models/comments-model';
import FilterModel from './models/filter-model';
import ProfileView from './view/profile-view';
import FilmsCounterView from './view/films-counter-view';
import FilmsPresenter from './presenter/films-presenter';
import NavigationPresenter from './presenter/navigation-presenter';
import StatsPresenter from './presenter/stats-presenter';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const apiService = new ApiService(API_URL, API_AUTHORIZATION);

const filmsModel = new FilmsModel(apiService);
const commentsModel = new CommentsModel(apiService, filmsModel);
const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const statsPresenter = new StatsPresenter(siteMainElement, filmsModel);

const handleNavigationClick = (screenType) => {
  if (screenType === ScreenType.STATS) {
    filmsPresenter.destroy();
    statsPresenter.init();
    return;
  }

  statsPresenter.destroy();
  filmsPresenter.init();
};

const navigationPresenter = new NavigationPresenter(siteMainElement, filterModel, filmsModel, handleNavigationClick);

navigationPresenter.init();
filmsPresenter.init();

filmsModel.init().finally(() => {
  render(siteHeaderElement, new ProfileView(filmsModel));
  render(footerStatisticsElement, new FilmsCounterView(filmsModel));
});
