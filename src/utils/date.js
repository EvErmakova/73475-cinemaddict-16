import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const formatDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getYear = (date) => dayjs(date).format('YYYY');

export const formatDuration = (minutes) => {
  const durationTime = dayjs.duration(minutes, 'minutes');
  return minutes < 60 ? durationTime.format('m[m]') : durationTime.format('H[h] m[m]');
};

export const getTimeFromNow = (date) => dayjs(date).fromNow();
