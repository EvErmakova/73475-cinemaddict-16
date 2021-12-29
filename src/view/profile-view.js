import SmartView from './smart-view';
import {UpdateType} from '../const';

const createProfileTemplate = (rank) => (
  rank ? `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>` : ''
);

export default class ProfileView extends SmartView {
  #rank = null;
  #filmsModel = null;

  constructor(filmsModel) {
    super();
    this.#filmsModel = filmsModel;
    this.#rank = this.#filmsModel.userRank;
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get template() {
    return createProfileTemplate(this.#rank);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MINOR) {
      this.#rank = this.#filmsModel.userRank;
      this.updateData({});
    }
  }

  restoreHandlers = () => {}
}
