import {EXTRA_FILM_COUNT} from '../const';

export const getFilmsCount = (films) => ({
  watchList: films.filter((film) => film.userDetails.watchlist).length,
  alreadyWatched: films.filter((film) => film.userDetails.alreadyWatched).length,
  favorite: films.filter((film) => film.userDetails.favorite).length
});

export const getFilmComments = ({comments}, commentsData) => (
  commentsData.filter((item) => comments.includes(item.id))
);

export const getTopRatedFilms = (films) => (
  films
    .sort((current, next) => next.filmInfo.totalRating - current.filmInfo.totalRating)
    .slice(0, EXTRA_FILM_COUNT)
);

export const getMostCommentedFilms = (films) => (
  films
    .sort((current, next) => next.comments.length - current.comments.length)
    .slice(0, EXTRA_FILM_COUNT)
);
