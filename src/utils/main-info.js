import dayjs from 'dayjs';

const isDatesChanged = (previousEvents, currentEvents) => {
  if (previousEvents.length !== currentEvents.length) {
    return true;
  }

  const sortedPreviousEvents = previousEvents.sort((eventA, eventB) => dayjs(eventA.dateFrom) - dayjs(eventB.dateFrom));
  const sortedCurrentEvents = currentEvents.sort((eventA, eventB) => dayjs(eventA.dateFrom) - dayjs(eventB.dateFrom));

  const prevDateFrom = dayjs(sortedPreviousEvents[0].dateFrom);
  const currentDateFrom = dayjs(sortedCurrentEvents[0].dateFrom);
  const prevDateTo = dayjs(sortedPreviousEvents[sortedPreviousEvents.length - 1].dateTo);
  const currentDateTo = dayjs(sortedCurrentEvents[sortedCurrentEvents.length - 1].dateTo);

  return !prevDateFrom.isSame(currentDateFrom, 'date') || !prevDateTo.isSame(currentDateTo, 'date');
};

const isCitiesChanged = (previousEvents, currentEvents, destinationsModel) => {
  if (previousEvents.length !== currentEvents.length) {
    return true;
  }

  const sortedPreviousEvents = previousEvents.sort((eventA, eventB) => new Date(eventA.dateFrom) - new Date(eventB.dateFrom));
  const sortedCurrentEvents = currentEvents.sort((eventA, eventB) => new Date(eventA.dateFrom) - new Date(eventB.dateFrom));

  if (sortedPreviousEvents.length > 3 || sortedCurrentEvents.length > 3) {
    if (
      destinationsModel.getDestinationById(sortedPreviousEvents[0].destination).name !== destinationsModel.getDestinationById(sortedCurrentEvents[0].destination).name ||
      destinationsModel.getDestinationById(sortedPreviousEvents[sortedPreviousEvents.length - 1].destination).name !== destinationsModel.getDestinationById(sortedCurrentEvents[sortedCurrentEvents.length - 1].destination).name
    ) {
      return true;
    }
  } else {
    for (let i = 0; i < sortedPreviousEvents.length; i++) {
      if (
        destinationsModel.getDestinationById(sortedPreviousEvents[i].destination).name !== destinationsModel.getDestinationById(sortedCurrentEvents[i].destination).name
      ) {
        return true;
      }
    }
  }

  return false;
};

const isCostChanged = (previousEvents, currentEvents, offersModel) => {
  if (previousEvents.length !== currentEvents.length) {
    return true;
  }

  const sortedPreviousEvents = previousEvents.sort((eventA, eventB) => new Date(eventA.dateFrom) - new Date(eventB.dateFrom));
  const sortedCurrentEvents = currentEvents.sort((eventA, eventB) => new Date(eventA.dateFrom) - new Date(eventB.dateFrom));

  for (let i = 0; i < sortedPreviousEvents.length; i++) {
    const prevEvent = sortedPreviousEvents[i];
    const currEvent = sortedCurrentEvents[i];

    if (prevEvent.basePrice !== currEvent.basePrice) {
      return true;
    }

    const prevOffers = offersModel.getCurrentOffers(offersModel.getOffersByType(prevEvent.type), prevEvent);
    const currOffers = offersModel.getCurrentOffers(offersModel.getOffersByType(currEvent.type), currEvent);

    if (prevOffers.length !== currOffers.length) {
      return true;
    }

    for (let j = 0; j < prevOffers.length; j++) {
      if (
        prevOffers[j].id !== currOffers[j].id
      ) {
        return true;
      }
    }
  }

  return false;
};

export { isDatesChanged, isCitiesChanged, isCostChanged };
