import AbstractView from '../../framework/view/abstract-view.js';
import { humanizeDateTime } from '../../utils/common.js';

function createEventTemplate(event, cityName, selectedOffers) {
  const { basePrice, type, dateFrom, dateTo, isFavorite, duration} = event;

  const departure = humanizeDateTime(dateFrom);
  const arrival = humanizeDateTime(dateTo);
  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return `
  <li class="trip-events__item">
  <div class="event">
                <time class="event__date" datetime="${departure.dateFull}">${departure.date}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${cityName}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${departure.dateTimeFull}">${departure.time}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${arrival.dateTimeFull}">${arrival.time}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${selectedOffers.map((offer) => `
                  <li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </li>`).join('')}
                </ul>
                <button class="${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
              </li>
  `;
}

export default class EventView extends AbstractView {
  #event = null;
  #handleOpenButtonClick = null;
  #handleFavoriteButtonClick = null;

  constructor ({event, cityName, selectedOffers, onOpenButtonClick, onFavoriteButtonClick}) {
    super();
    this.#event = event;
    this.cityName = cityName;
    this.selectedOffers = selectedOffers;
    this.#handleOpenButtonClick = onOpenButtonClick;
    this.#handleFavoriteButtonClick = onFavoriteButtonClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openButtonClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteButtonClickHandler);
  }

  get template() {
    return createEventTemplate(this.#event, this.cityName, this.selectedOffers);
  }

  #openButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleOpenButtonClick();
  };

  #favoriteButtonClickHandler = () => {
    this.#handleFavoriteButtonClick();
  };
}
