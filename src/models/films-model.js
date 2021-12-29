import AbstractObservable from './abstract-observable';
import {EXTRA_FILM_COUNT} from '../const';
import {getSortedFilms} from '../utils/sorts';
import {filter} from '../utils/filters';

export default class FilmsModel extends AbstractObservable {
  #films = [];

  get films() {
    return [...this.#films];
  }

  set films(films) {
    this.#films = [...films];
  }

  get topFilms() {
    return getSortedFilms([...this.films], 'rating').slice(0, EXTRA_FILM_COUNT);
  }

  get viralFilms() {
    return getSortedFilms([...this.films], 'comments').slice(0, EXTRA_FILM_COUNT);
  }

  get userRank() {
    const count = filter.history(this.films).length;
    if (count <= 10) {
      return 'Novice';
    }
    if (count <= 20) {
      return 'Fan';
    }
    return 'Movie buff';
  }

  addComment = (type, {film, comment}) => {
    const updatedFilm = {
      ...film,
      comments: [...film.comments, comment.id]
    };

    delete updatedFilm.activeEmoji;
    delete updatedFilm.commentText;

    this.update(type, updatedFilm);
  }

  deleteComment = (type, id) => {
    const film = this.films.find(({comments}) => comments.includes(id));
    const updatedFilm = {
      ...film,
      comments: film.comments.filter((item) => item !== id)
    };

    this.update(type, updatedFilm);
  }

  update = (type, updatedFilm) => {
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
}
