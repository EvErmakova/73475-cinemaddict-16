import SmartView from './smart-view';
import {filter} from '../utils/filters';

const createProfileTemplate = (count) => {
  const getRank = () => {
    if (count <= 10) {
      return 'Novice';
    } else if (count <= 20) {
      return 'Fan';
    } else {
      return 'Movie buff';
    }
  };

  if (count === 0) {
    return '';
  }

  return `<section class="header__profile profile">
    <p class="profile__rating">${getRank()}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileView extends SmartView {
  #count = null;
  #filmsModel = null;

  constructor(filmsModel) {
    super();
    this.#filmsModel = filmsModel;
    this.#count = filter.history(this.#filmsModel.films).length;
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get template() {
    return createProfileTemplate(this.#count);
  }

  #handleModelEvent = () => {
    this.#count = filter.history(this.#filmsModel.films).length;
    this.updateData({});
  }

  restoreHandlers = () => {}
}
