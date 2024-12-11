import TripSort from '../view/trip-sort';
import { render } from '../render.js';

export default class TripSortPresentor {
  sortComponent = new TripSort();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(this.sortComponent, this.container);
  }
}

