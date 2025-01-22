import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { humanizeTaskDateTime } from '../../utils/common.js';
import { TYPES_POINT } from '../../const.js';
import flatpickr from 'flatpickr';
import { calculateDuration } from '../../utils/common.js';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

function createEditableEventTemplate(state, isNewEvent) {
  const { type, destination ,dateFrom, dateTo, basePrice, offers, currentDestination, destinationsNames, offersByType } = state;

  const departure = humanizeTaskDateTime(dateFrom);
  const arrival = humanizeTaskDateTime(dateTo);
  const getStatusOffer = (id) => {
    if (offers.length !== 0) {
      return offers.includes(id) ? 'checked' : '';
    }
    return '';
  };

  const getDestinationInfo = () => {
    if (currentDestination && currentDestination.description && currentDestination.pictures) {
      return `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${currentDestination.description}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${currentDestination.pictures.map((picture) =>`
                        <img class="event__photo" src="${picture.src}" alt="${picture.description}">
                      `).join('')}
                      </div>
                    </div>
                  </section>`;
    } else {
      return '';
    }
  };

  const getOffersByType = () => {
    if (offersByType.offers.length !== 0) {
      return `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">

                      ${offersByType.offers.map((offer) =>
    `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${offer.id}" type="checkbox" name="event-offer-${offer.title}"
                        data-id="${offer.id}"
                        ${getStatusOffer(offer.id)}>
                        <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`).join('')}
                    </div>
                  </section>`;
    } else {
      return '';
    }
  };

  const getStatusType = (itemType) => itemType.toLowerCase() === type ? 'checked' : '';

  return `
  <li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
${TYPES_POINT.map((item) =>`
                        <div class="event__type-item">
                          <input id="event-type-${item.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.toLowerCase()}" ${getStatusType(item)}>
                          <label class="event__type-label  event__type-label--${item.toLowerCase()}" for="event-type-${item.toLowerCase()}-1">${item}</label>
                        </div>`
  ).join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${destination}">
                    ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${destination}" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-1">
                    <datalist id="destination-list-1">
                    ${destinationsNames.map((city) =>`<option value="${he.encode(city)}"></option>`).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${!isNewEvent ? departure.editableDate : ''}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${!isNewEvent ? arrival.editableDate : ''}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="1" step="1" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">${isNewEvent ? 'Cancel' : 'Delete'}</button>
                  ${isNewEvent ? '' : `<button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`}
                </header>
                <section class="event__details">
                ${getOffersByType()}
                ${ getDestinationInfo()}
                </section>
              </form>
              </li>
  `;
}

export default class EditablePoint extends AbstractStatefulView {
  #event = {};
  #offers = [];
  #destinations = [];
  #handleFormSubmit = null;
  #handleCloseButtonClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick = null;
  #isNewEvent = false;

  constructor ({event, allOffers, allDestinations, onFormSubmit, onCloseButtonClick, onDeleteClick, isNewEvent}) {
    super();
    this.#event = event;
    this.#offers = allOffers;
    this.#destinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseButtonClick = onCloseButtonClick;
    this.#handleDeleteClick = onDeleteClick;
    this. #isNewEvent = isNewEvent;
    this._setState(EditablePoint.parseEventToState(this.#event, this.#offers, this.#destinations));
    this._restoreHandlers();
  }

  get template() {
    return createEditableEventTemplate(this._state, this.#isNewEvent);
  }

  removeElement() {
    super.removeElement();
    if (this.#datepickerFrom || this.#datepickerTo) {
      this.#datepickerFrom.destroy();
      this.#datepickerTo.destroy();
      this.#datepickerFrom = null;
      this.#datepickerTo = null;
    }
  }

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({...this._state, dateFrom: userDate});
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({...this._state, dateTo: userDate});
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #setDatepicker() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {firstDayOfWeek: 1},
      'time_24hr':true
    };

    if (this.#isNewEvent) {
      this.#datepickerFrom = flatpickr(
        dateFromElement,
        {
          ...commonConfig,
          onClose: this.#dateFromCloseHandler,
        }
      );

      this.#datepickerTo = flatpickr(
        dateToElement,
        {
          ...commonConfig,
          onClose: this.#dateToCloseHandler,
        }
      );
      return;
    }

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom ,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.dateTo
      }
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom
      }
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      basePrice: Number(this.#getBasePrice()),
      destination: this._state.currentDestination.id,
    });
    this.#isNewEvent = false;
    this.#handleFormSubmit(EditablePoint.parseStateToEvent(this._state));
  };

  #closeButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseButtonClick();
  };

  #eventTypeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offersByType: this.#offers.getOffersByType(evt.target.value),
      offers: []
    });
  };

  #offerChangeHandler = (evt) => {
    const offerId = evt.target.dataset.id;
    const isChecked = evt.target.checked;

    this.updateElement({
      offers: isChecked ? [...this._state.offers, offerId] : this._state.offers.filter((offer) => offer !== offerId)
    });
  };

  #getBasePrice = () => this.element.querySelector('.event__input--price').value;

  #destinationChangeHandler = (evt) => {
    this.updateElement({
      currentDestination: evt.target.value ? this.#destinations.getDestinationByName(evt.target.value) : '',
    });
  };

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    if (!this.#isNewEvent) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeButtonHandler);
    }
    if(this._state.offersByType.offers.length !== 0) {
      this.element.querySelectorAll('.event__offer-checkbox')
        .forEach((checkbox) => checkbox.addEventListener('change', this.#offerChangeHandler));
    }
    this.#setDatepicker();
  }

  reset = () => {
    this._setState(EditablePoint.parseEventToState(this.#event, this.#offers, this.#destinations));
    this.updateElement(this._state);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    if(this.#isNewEvent){
      this.#handleDeleteClick();
      return;
    }
    this.#handleDeleteClick(EditablePoint.parseStateToEvent(this._state));
  };

  static parseEventToState(event, offers, destinations) {
    const offersByType = offers.getOffersByType(event.type);

    return {...event,
      offersByType: offersByType,
      selectedOffers: offers.getCurrentOffers(offersByType, event),
      currentDestination: destinations.getDestinationById(event.destination),
      destinationsNames: destinations.destinationsNames
    };
  }

  static parseStateToEvent(state) {
    return{...state,
      duration: calculateDuration(state.dateFrom, state.dateTo)
    };
  }
}
