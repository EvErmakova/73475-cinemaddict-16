import {getFilmsCount} from '../services/data';

const filmToFilterMap = {
  watchlist: (films) => getFilmsCount(films).watchList,
  history: (films) => getFilmsCount(films).alreadyWatched,
  favorites: (films) => getFilmsCount(films).favorite
};

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, filmsCount]) => ({
    name: filterName,
    count: filmsCount(films)
  })
);
