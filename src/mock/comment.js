import {getRandomArrayItem, getRandomDate, getRandomInteger} from '../services/utils';
import {COMMENTS_COUNT, emotions} from '../services/constants';

const authors = [
  'Tim Macoveev',
  'John Doe',
  'Evgeniia Ermakova',
  'Keks'
];

const comments = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?'
];

export const generateComment = () => ({
  id: getRandomInteger(1, COMMENTS_COUNT),
  author: getRandomArrayItem(authors),
  comment: getRandomArrayItem(comments),
  date: getRandomDate(2, 1),
  emotion: getRandomArrayItem(emotions)
});
