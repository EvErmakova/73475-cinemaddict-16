import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';

import {StatsFilterType} from '../const';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);

export const isFilmWatchedInPeriod = ({userDetails: {watchingDate}}, period) => {
  if (period === StatsFilterType.ALL.type) {
    return true;
  }
  if (period === StatsFilterType.TODAY.type) {
    return dayjs(watchingDate).isToday();
  }
  return dayjs(watchingDate).isSameOrAfter(dayjs().subtract(1, period));
};
