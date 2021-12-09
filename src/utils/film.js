export const getFilmsCount = (films) => ({
  watchList: films.filter((film) => film.userDetails.watchlist).length,
  alreadyWatched: films.filter((film) => film.userDetails.alreadyWatched).length,
  favorite: films.filter((film) => film.userDetails.favorite).length
});
