import {COMMENTS_COUNT, FILMS_COUNT} from './services/constants';
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

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeFilmDetails();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  render(container, filmCardElement);

  const filmCardLinkElement = filmCardElement.querySelector('.film-card__link');
  filmCardLinkElement.addEventListener('click', () => {
    openFilmDetails();
    document.addEventListener('keydown', onEscKeyDown);
  });

  const filmDetailsCloseButton = filmDetailsElement.querySelector('.film-details__close-btn');
  filmDetailsCloseButton.addEventListener('click', () => {
    closeFilmDetails();
    document.removeEventListener('keydown', onEscKeyDown);
  });
};

const renderFilmsList = (container, title, films, count = films.length) => {
  const listElement = new FilmsListView().element;
  render(container, listElement);

  const titleElement = listElement.querySelector('.films-list__title');
  const containerElement = listElement.querySelector('.films-list__container');

  titleElement.innerHTML = title;

  for (let i = 0; i < count; i++) {
    const film = films[i];
    renderFilm(containerElement, film);
  }

  return {listElement, titleElement, containerElement};
};

const renderSimpleFilmsList = (container, films) => {
  const FILM_COUNT_PER_STEP = 5;

  const {
    titleElement: simpleFilmsTitleElement,
    listElement: simpleFilmsListElement,
    containerElement: simpleFilmsContainerElement
  } = renderFilmsList(container, 'All movies. Upcoming', films, Math.min(films.length, FILM_COUNT_PER_STEP));

  simpleFilmsTitleElement.classList.add('visually-hidden');

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const moreButtonComponent = new MoreButtonView();
    render(simpleFilmsListElement, moreButtonComponent.element);

    moreButtonComponent.element.addEventListener('click', (event) => {
      event.preventDefault();
      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(simpleFilmsContainerElement, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        moreButtonComponent.element.remove();
        moreButtonComponent.removeElement();
      }
    });
  }
};

const renderFilms = (container, films) => {
  const filmsElement = new FilmsView().element;
  const alreadyWatchedCount = getFilmsCount(films).alreadyWatched;

  if (!films.length > 0) {
    render(container, filmsElement);
    render(filmsElement, new NoFilmsView().element);
    return;
  }

  render(siteHeaderElement, new ProfileView(alreadyWatchedCount).element);
  render(container, new SortView().element);
  render(container, filmsElement);

  renderSimpleFilmsList(filmsElement, films);

  if (films.some((film) => film.filmInfo.totalRating > 0)) {
    const {
      listElement: topFilmsListElement
    } = renderFilmsList(filmsElement, 'Top rated', getTopRatedFilms(filmsData));
    topFilmsListElement.classList.add('films-list--extra');
  }

  if (films.some((film) => film.comments.length > 0)) {
    const {
      listElement: mostCommentedFilmsListElement
    } = renderFilmsList(filmsElement, 'Most commented', getMostCommentedFilms(filmsData));
    mostCommentedFilmsListElement.classList.add('films-list--extra');
  }
};

render(siteMainElement, new MainNavigationView(filters).element);
renderFilms(siteMainElement, filmsData);
render(footerStatisticsElement, new FilmsCounterView(filmsData.length).element);
