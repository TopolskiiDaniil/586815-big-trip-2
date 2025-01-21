import AbstractView from '../../framework/view/abstract-view.js';
import { MessageListEmpty } from '../../const.js';

function createListEmptyMessageTemplate (filterType) {
  return `
<p class="trip-events__msg">${MessageListEmpty[filterType]}</p>
`;
}

export default class ListEmptyMessageView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createListEmptyMessageTemplate(this.#filterType);
  }
}
