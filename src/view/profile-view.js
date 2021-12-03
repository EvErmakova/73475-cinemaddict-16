import AbstractView from './abstract-view';

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

export default class ProfileView extends AbstractView {
  #count = null;

  constructor(count = 0) {
    super();
    this.#count = count;
  }

  get template() {
    return createProfileTemplate(this.#count);
  }
}
