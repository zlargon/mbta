const defaultState = {
  inbound: {
    route: {
      direction: []
    },
    stop: {},
    destination: {},
    departureTime: []
  },
  outbound: {
    route: {
      direction: []
    },
    stop: {},
    destination: {},
    departureTime: []
  }
}

const searchScheduleReducer = (state = defaultState, action) => {

  if (action.type === 'SEARCH_SCHEDULE') {

    const route = {
      id: action.route.id,
      name: action.route.name,
      short_name: action.route.short_name,
      color: action.route.color,
      text_color: action.route.text_color,
      direction: action.route.direction
    };
    const {stop, departureTimes } = action;

    return {
      inbound: {
        route: route,
        stop: stop,
        direct_id: 0,
        destination: action.route.stops[action.route.stops.length - 1],
        isFailed: false,
        departureTime: departureTimes[0]
      },
      outbound: {
        route: route,
        stop: stop,
        direct_id: 1,
        destination: action.route.stops[0],
        isFailed: false,
        departureTime: departureTimes[1]
      }
    };
  }

  return state;
}

export default searchScheduleReducer;
