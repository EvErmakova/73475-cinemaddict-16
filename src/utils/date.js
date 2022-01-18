import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const formatDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getYear = (date) => dayjs(date).format('YYYY');

export const getDuration = (minutes) => {
  const time = dayjs.duration(minutes, 'minutes');
  return {
    hours: time.format('H'),
    minutes: time.format('m'),
  };
};

export const formatDuration = (minutes) => {
  const time = getDuration(minutes);
  return minutes < 60 ? `${time.minutes}m` : `${time.hours}h ${time.minutes}m`;
};

export const getTimeFromNow = (date) => dayjs(date).fromNow();
