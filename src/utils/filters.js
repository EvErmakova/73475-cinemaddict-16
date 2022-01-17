import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL.type]: (films) => films,
  [FilterType.WATCHLIST.type]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY.type]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES.type]: (films) => films.filter((film) => film.userDetails.favorite),
};
