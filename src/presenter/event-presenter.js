import EventPoint from '../view/trip-events/event-point-view.js';
import EditablePoint from '../view/trip-events/edit-event-point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey, getUpdateType} from '../utils/common.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #container = null;
  #offersModel = [];
  #destinationsModel = [];
  #eventData = {};
  #eventPointComponent = null;
  #editablePointComponent = null;
  #handleDataChange = null;
  #onPointStateChange = null;
  #mode = Mode.DEFAULT;

  constructor({container, destinationsModel, offersModel,eventData, onDataChange, onPointStateChange}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventData = eventData;
    this.#handleDataChange = onDataChange;
    this.#onPointStateChange = onPointStateChange;
  }

  init(eventData) {
    this.#eventData = eventData;
    const offersByType = this.#offersModel.getOffersByType(this.#eventData.type);
    this.#renderEvent(this.#eventData, offersByType);
  }

  #renderEvent (event, offersByType) {
    const prevEventPointComponent = this.#eventPointComponent;
    const prevEditablePointComponent = this.#editablePointComponent;

    this.#eventPointComponent = new EventPoint({
      event: event,
      selectedOffers: this.#offersModel.getCurrentOffers(offersByType, event),
      cityName: this.#destinationsModel.getDestinationById(event.destination).name,
      onOpenButtonClick: this.#openButtonClickHandler,
      onFavoriteButtonClick: this.#toggleFavoriteStatus
    });

    this.#editablePointComponent = new EditablePoint({
      event: event,
      allOffers: this.#offersModel,
      allDestinations: this.#destinationsModel,
      onFormSubmit: this.#formSubmitHandler,
      onCloseButtonClick: this.#closeButtonClickHandler,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevEventPointComponent === null || prevEditablePointComponent === null) {
      render(this.#eventPointComponent, this.#container.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventPointComponent, prevEventPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editablePointComponent, prevEditablePointComponent);
    }

    remove(prevEventPointComponent);
    remove(prevEditablePointComponent);
  }

  #openEditForm () {
    this.#onPointStateChange();
    replace(this.#editablePointComponent, this.#eventPointComponent);
    this.#mode = Mode.EDITING;
  }

  #closeEditForm () {
    this.#editablePointComponent.reset();
    replace(this.#eventPointComponent, this.#editablePointComponent);
    this.#mode = Mode.DEFAULT;
  }

  #toggleFavoriteStatus = () => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      {...this.#eventData, isFavorite: !this.#eventData.isFavorite},
    );
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#closeEditForm();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #openButtonClickHandler = () => {
    this.#openEditForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #formSubmitHandler = (updatedEvent) => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      getUpdateType(updatedEvent, this.#eventData) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedEvent,
    );
    this.#closeEditForm();
  };

  #closeButtonClickHandler = () => {
    this.#closeEditForm();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  resetLastEditForm () {
    if (this.#mode === Mode.EDITING) {
      this.#closeEditForm();
    }
  }

  destroy() {
    remove(this.#eventPointComponent);
    remove(this.#editablePointComponent);
  }

  #handleDeleteClick = (event) => {
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };
}
