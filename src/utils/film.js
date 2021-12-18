import dayjs from 'dayjs';

export const getFilmsCount = (films) => ({
  watchList: films.filter((film) => film.userDetails.watchlist).length,
  alreadyWatched: films.filter((film) => film.userDetails.alreadyWatched).length,
  favorite: films.filter((film) => film.userDetails.favorite).length
});

export const getSortedFilms = (films, sortType) => (
  films.sort((current, next) => {
    if (sortType === 'date') {
      return dayjs(next.filmInfo.release.date).diff(dayjs(current.filmInfo.release.date));
    }

    if (sortType === 'rating') {
      return next.filmInfo.totalRating - current.filmInfo.totalRating;
    }

    if (sortType === 'comments') {
      return next.comments.length - current.comments.length;
    }

    throw new Error('Invalid sortType');
  })
);
