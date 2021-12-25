import AbstractObservable from './abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = [...comments];
  }
}
