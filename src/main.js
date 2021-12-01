import {COMMENTS_COUNT, EXTRA_FILM_COUNT, FILMS_COUNT} from './services/constants';
import {getFilmsCount, getMostCommentedFilms, getTopRatedFilms} from './services/data';
import {render} from './render';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import {generateFilter} from './mock/filter';
import SortView from './view/sort-view';
import ProfileView from './view/profile-view';
import MainNavigationView from './view/main-navigation-view';
import FilmsCounterView from './view/films-counter-view';
import FilmsView from './view/films-view';
import FilmsListView from './view/films-list-view';
import FilmCardView from './view/film-card-view';
import MoreButtonView from './view/more-button-view';
import FilmDetailsView from './view/film-details-view';
import FilmCommentView from './view/film-comment-view';
import NoFilmsView from './view/no-films-view';

const filmsData = Array.from({length: FILMS_COUNT}, generateFilm);
const commentsData = Array.from({length: COMMENTS_COUNT}, generateComment);
const filters = generateFilter(filmsData);

const getFilmComments = ({comments}) => (
  commentsData.filter((item) => comments.includes(item.id))
);

const bodyElement = document.body;
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const alreadyWatchedCount = getFilmsCount(filmsData).alreadyWatched;

const renderFilm = (container, film) => {
  const filmCardElement = new FilmCardView(film).element;
  const filmDetailsElement = new FilmDetailsView(film).element;

  const openFilmDetails = () => {
    bodyElement.classList.add('hide-overflow');
    bodyElement.appendChild(filmDetailsElement);

    const commentsListElement = filmDetailsElement.querySelector('.film-details__comments-list');
    for (let i = 0; i < film.comments.length; i++) {
      const comment = getFilmComments(film)[i];
      render(commentsListElement, new FilmCommentView(comment).element);
    }
  };

  const closeFilmDetails = () => {
    bodyElement.classList.remove('hide-overflow');
    bodyElement.removeChild(filmDetailsElement);
  };

  render(container, filmCardElement);

  const filmCardLinkElement = filmCardElement.querySelector('.film-card__link');
  filmCardLinkElement.addEventListener('click', () => openFilmDetails());

  const filmDetailsCloseButton = filmDetailsElement.querySelector('.film-details__close-btn');
  filmDetailsCloseButton.addEventListener('click', () => closeFilmDetails());
};

const renderFilms = (filmsContainer, filmsList) => {
  const filmsComponent = new FilmsView();

  const renderFilmsList = (title, count, films) => {
    const listElement = new FilmsListView().element;
    render(filmsComponent.element, listElement);

    const titleElement = listElement.querySelector('.films-list__title');
    const containerElement = listElement.querySelector('.films-list__container');

    titleElement.innerHTML = title;

    for (let i = 0; i < count; i++) {
      const film = films[i];
      renderFilm(containerElement, film);
    }

    return {listElement, titleElement, containerElement};
  };

  const renderSimpleFilmsList = (films) => {
    const FILM_COUNT_PER_STEP = 5;

    const {
      titleElement: simpleFilmsTitleElement,
      listElement: simpleFilmsListElement,
      containerElement: simpleFilmsContainerElement
    } = renderFilmsList('All movies. Upcoming', Math.min(films.length, FILM_COUNT_PER_STEP), films);

    simpleFilmsTitleElement.classList.add('visually-hidden');

    if (films.length > FILM_COUNT_PER_STEP) {
      let renderedFilmCount = FILM_COUNT_PER_STEP;

      const moreButtonComponent = new MoreButtonView();
      render(simpleFilmsListElement, moreButtonComponent.element);

      moreButtonComponent.element.addEventListener('click', (event) => {
        event.preventDefault();
        films
          .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
          .forEach((film) => render(simpleFilmsContainerElement, new FilmCardView(film).element));

        renderedFilmCount += FILM_COUNT_PER_STEP;

        if (renderedFilmCount >= films.length) {
          moreButtonComponent.element.remove();
          moreButtonComponent.removeElement();
        }
      });
    }
  };

  if (!filmsList.length > 0) {
    render(filmsContainer, filmsComponent.element);
    render(filmsComponent.element, new NoFilmsView().element);
    return;
  }

  render(filmsContainer, new SortView().element);
  render(filmsContainer, filmsComponent.element);
  renderSimpleFilmsList(filmsList);

  if (filmsList.some((film) => film.filmInfo.totalRating > 0)) {
    const {
      listElement: topFilmsListElement
    } = renderFilmsList('Top rated', EXTRA_FILM_COUNT, getTopRatedFilms(filmsData));
    topFilmsListElement.classList.add('films-list--extra');
  }

  if (filmsList.some((film) => film.comments.length > 0)) {
    const {
      listElement: mostCommentedFilmsListElement
    } = renderFilmsList('Most commented', EXTRA_FILM_COUNT, getMostCommentedFilms(filmsData));
    mostCommentedFilmsListElement.classList.add('films-list--extra');
  }
};

render(siteHeaderElement, new ProfileView(alreadyWatchedCount).element);
render(siteMainElement, new MainNavigationView(filters).element);
renderFilms(siteMainElement, filmsData);
render(footerStatisticsElement, new FilmsCounterView(filmsData.length).element);
