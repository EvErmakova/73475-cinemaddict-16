const createRatingTemplate = (count) => {
  const getRank = () => {
    if (count <= 10) {
      return 'Novice';
    } else if (count <= 20) {
      return 'Fan';
    } else {
      return 'Movie buff';
    }
  };

  return `<p class="profile__rating">${getRank()}</p>`;
};

export const createProfileTemplate = (count) => {
  const rating = count > 0 ? createRatingTemplate(count) : '';

  return `<section class="header__profile profile">
    ${rating}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
