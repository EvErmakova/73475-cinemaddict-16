import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getFormatDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getDateYear = (date) => dayjs(date).format('YYYY');

export const getFormatTime = (time) => {
  if (time < 60) {
    return `${time}m`;
  } else {
    const hours = Math.floor(time / 60);
    const minutes = time % 60 !== 0 ? `${time % 60}m` : '';
    return `${hours}h ${minutes}`;
  }
};

export const getTimeFromNow = (date) => dayjs(date).fromNow();
