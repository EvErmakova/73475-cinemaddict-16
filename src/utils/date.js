import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getFormatDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getYear = (date) => dayjs(date).format('YYYY');

export const getFormatTime = (time) => {
  const formatTime = dayjs.duration(time * 60000);

  if (time < 60) {
    return `${formatTime.minutes()}m`;
  }

  return `${formatTime.hours()}h ${formatTime.minutes()}m`;

};

export const getTimeFromNow = (date) => dayjs(date).fromNow();
