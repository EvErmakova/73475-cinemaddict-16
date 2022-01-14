import AbstractObservable from './abstract-observable';
import {EXTRA_FILM_COUNT, UpdateType} from '../const';
import {getSortedFilms} from '../utils/sorts';
import {filter} from '../utils/filters';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return [...this.#films];
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  get topFilms() {
    return getSortedFilms([...this.films], 'rating').slice(0, EXTRA_FILM_COUNT);
  }

  get viralFilms() {
    return getSortedFilms([...this.films], 'comments').slice(0, EXTRA_FILM_COUNT);
  }

  get userRank() {
    const count = filter.history(this.films).length;
    if (count === 0) {
      return null;
    }
    if (count <= 10) {
      return 'Novice';
    }
    if (count <= 20) {
      return 'Fan';
    }
    return 'Movie buff';
  }

  get watchedFilms() {
    return [...this.films].filter((film) => film.userDetails.alreadyWatched);
  }

  addComment = (type, filmId, comments) => {
    const updatedFilm = {
      ...this.films.find(({id}) => id === filmId),
      comments: comments
    };

    this.#updateList(type, updatedFilm);
  }

  deleteComment = (type, id) => {
    const film = this.films.find(({comments}) => comments.includes(id));
    const updatedFilm = {
      ...film,
      comments: film.comments.filter((item) => item !== id)
    };

    this.#updateList(type, updatedFilm);
  }

  updateFilm = async (type, update) => {
    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#updateList(type, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  }

  #updateList = (type, updatedFilm) => {
    const index = this.#films.findIndex((item) => item.id === updatedFilm.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      updatedFilm,
      ...this.#films.slice(index + 1),
    ];

    this._notify(type, updatedFilm);
  }

  #adaptToClient = (film) => {
    const userDetails = film['user_details'];
    const filmInfo = film['film_info'];

    const adaptedFilm = {
      id: film.id,
      filmInfo: {
        ...filmInfo,
        alternativeTitle: filmInfo['alternative_title'],
        totalRating: filmInfo['total_rating'],
        ageRating: filmInfo['age_rating'],
        release: {
          date: new Date(filmInfo['release']['date']),
          releaseCountry: filmInfo['release']['release_country']
        },
      },
      userDetails: {
        ...userDetails,
        alreadyWatched: userDetails['already_watched'],
        watchingDate: userDetails['watching_date'] !== null ? new Date(userDetails['watching_date']) : null,
      },
      comments: film.comments
    };

    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo.release['release_country'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];

    return adaptedFilm;
  }
}
