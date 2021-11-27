import {getRandomArrayItem, getRandomBoolean, getRandomDate, getRandomInteger} from '../services/utils';
import {COMMENTS_COUNT, FILMS_COUNT} from '../services/constants';

const MIN_DESCRIPTION_COUNT = 1;
const MAX_DESCRIPTION_COUNT = 5;
const MIN_COMMENT_COUNT = 0;
const MAX_COMMENT_COUNT = 5;

const posters = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg'
];

const titles = [
  'Made for Each Other',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man with the Golden Arm'
];

const countries = [
  'USA',
  'France',
  'Italy',
  'Finland'
];

const generatePersons = (count) => {
  const persons = [
    'Anthony Mann',
    'Anne Wigton',
    'Heinz Herald',
    'Richard Weil',
    'Erich von Stroheim',
    'Mary Beth Hughes',
    'Dan Duryea'
  ];

  const personsList = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomInteger(0, persons.length - 1);
    personsList.push(persons[randomIndex]);
  }

  return personsList;
};

const generateGenre = () => {
  const genres = [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon',
    'Mystery'
  ];
  const randomCount = getRandomInteger(1, 3);

  const genresList = [];
  for (let i = 0; i < randomCount; i++) {
    const randomIndex = getRandomInteger(0, genres.length - 1);
    genresList.push(genres[randomIndex]);
  }

  return genresList;
};

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.'
  ];
  const randomCount = getRandomInteger(MIN_DESCRIPTION_COUNT, MAX_DESCRIPTION_COUNT);

  const description = [];
  for (let i = 0; i < randomCount; i++) {
    const randomIndex = getRandomInteger(0, descriptions.length - 1);
    description.push(descriptions[randomIndex]);
  }

  return description.join(' ');
};

const generateCommentsId = () => {
  const commentsId = [];
  const randomCount = getRandomInteger(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT);

  for (let i = 0; i < randomCount; i++) {
    commentsId.push(getRandomInteger(1, COMMENTS_COUNT));
  }

  return commentsId;
};

export const generateFilm = () => ({
  id: getRandomInteger(1, FILMS_COUNT),
  filmInfo: {
    title: getRandomArrayItem(titles),
    alternativeTitle: getRandomArrayItem(titles),
    totalRating: getRandomInteger(1, 10),
    poster: getRandomArrayItem(posters),
    ageRating: getRandomInteger(0, 21),
    director: generatePersons(1),
    writers: generatePersons(getRandomInteger(1, 3)),
    actors: generatePersons(getRandomInteger(1, 5)),
    release: {
      date: getRandomDate(30, 1),
      releaseCountry: getRandomArrayItem(countries)
    },
    runtime: getRandomInteger(30, 180),
    genre: generateGenre(),
    description: generateDescription()
  },
  userDetails: {
    watchlist: getRandomBoolean(),
    alreadyWatched: getRandomBoolean(),
    watchingDate: getRandomDate(5, 1),
    favorite: getRandomBoolean()
  },
  comments: generateCommentsId()
});
