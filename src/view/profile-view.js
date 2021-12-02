import {createElement} from '../render';

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

export default class ProfileView {
  #element = null;
  #count = null;

  constructor(count) {
    this.#count = count;
  }

  get template() {
    return createProfileTemplate(this.#count);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
