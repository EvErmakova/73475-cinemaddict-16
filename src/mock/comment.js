import dayjs from 'dayjs';
import {getRandomArrayItem, getRandomInteger} from '../utils/common';
import {EMOTIONS} from '../const';

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

let index = 1;

export const generateComment = () => {
  const commentData = {
    id: index.toString(),
    author: getRandomArrayItem(authors),
    comment: getRandomArrayItem(comments),
    date: dayjs().subtract(getRandomInteger(0, 250), 'day').toDate(),
    emotion: getRandomArrayItem(EMOTIONS)
  };

  index++;
  return commentData;
};
