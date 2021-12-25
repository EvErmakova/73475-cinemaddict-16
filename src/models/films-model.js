import AbstractObservable from './abstract-observable';

export default class FilmsModel extends AbstractObservable {
  #films = [];

  get films() {
    return [...this.#films];
  }

  set films(films) {
    this.#films = [...films];
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
