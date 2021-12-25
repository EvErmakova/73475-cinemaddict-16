import AbstractObservable from './abstract-observable';

export default class FilmsModel extends AbstractObservable {
  #films = [];

  get films() {
    return this.#films;
  }

  set films(films) {
    this.#films = [...films];
  }
}
