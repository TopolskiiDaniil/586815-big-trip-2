import TripInfoPresentor from './presenter/trip-info-presenter.js';
import TripFiltresPresentor from './presenter/trip-filtres-presenter.js';
import TripSortPresentor from './presenter/trip-sort-presenter.js';
import TripEventsPresentor from './presenter/trip-events-presenter.js';
import TasksModel from './model/tasks-model.js';

const tripHeaderContainer = document.querySelector('.trip-main');
const tripFiltresContainer = tripHeaderContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripInfoPresentor = new TripInfoPresentor({container: tripHeaderContainer});
const tripFiltresPresentor = new TripFiltresPresentor({container: tripFiltresContainer});
const sortPresentor = new TripSortPresentor({container: tripEventsContainer });

const tasksModel = new TasksModel();
const eventPointsPresentor = new TripEventsPresentor({
  container: tripEventsContainer,
  tasksModel
});

tripInfoPresentor.init();
tripFiltresPresentor.init();
sortPresentor.init();
eventPointsPresentor.init();
