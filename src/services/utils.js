import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const getRandomBoolean = () => Boolean(getRandomInteger(0, 1));

export const getRandomDate = (minDateGap, maxDateGap) => {
  const dateGap = getRandomInteger(-minDateGap, maxDateGap);

  return dayjs().add(dateGap, 'year').toDate();
};

export const getFormattedTime = (time) => {
  let duration = '';
  let hours = 0;
  let minutes = time;

  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    duration += `${hours}h `;
  }

  if (minutes > 0) {
    duration += `${minutes}m`;
  }

  return duration.trim();
};
