import AbstractView from './abstract-view';

const createMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class MoreButtonView extends AbstractView {
  get template() {
    return createMoreButtonTemplate();
  }
}
