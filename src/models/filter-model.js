import AbstractObservable from './abstract-observable';
import {FilterType} from '../const';

export default class FilterModel extends AbstractObservable {
  #filter = FilterType.ALL.type;

  get filter() {
    return this.#filter;
  }

  setFilter = (type, filter) => {
    this.#filter = filter;
    this._notify(type, filter);
  }
}
