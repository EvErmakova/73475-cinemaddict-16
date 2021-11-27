import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export const createFilmsCommentTemplate = ({author, comment, date, emotion}) => {
  dayjs.extend(relativeTime);
  const commentDay = dayjs(date).fromNow();

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDay}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};
