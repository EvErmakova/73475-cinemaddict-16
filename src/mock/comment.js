import {getRandomArrayItem, getRandomDate} from '../utils/common';
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
    date: getRandomDate(2, 1),
    emotion: getRandomArrayItem(EMOTIONS)
  };

  index++;
  return commentData;
};
