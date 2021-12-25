import AbstractObservable from './abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  get comments() {
    return [...this.#comments];
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  add = (type, newComment) => {
    this.#comments = [
      ...this.#comments,
      newComment
    ];

    this._notify(type, newComment);
  }

  delete = (type, comment) => {
    const index = this.#comments.findIndex((item) => item.id === comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(type);
  }
}
