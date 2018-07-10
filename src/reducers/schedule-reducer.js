const defultState = JSON.parse(localStorage.getItem('schedules') || '{}');

const scheduleReducer = (state = defultState, action) => {

  let newState = state;

  // 1. Add
  if (action.type === 'SCHEDULE_ADD') {
    const { route, stop, direct_id } = action;
    const key = [route.id, stop.id, direct_id].join('_');

    newState = {
      ...state,
      [key]: {
        route: {
          id: route.id,
          name: route.name,
          color: route.color,
          text_color: route.text_color,
          direction: route.direction
        },
        stop: stop,
        direct_id: direct_id,
        destination: route.stops[direct_id === 1 ? 0 : route.stops.length - 1],
        isFailed: false,
        departureTime: action.departureTime
      }
    }
  }

  // 2. Remove
  if (action.type === 'SCHEDULE_REMOVE') {
    const key = [action.route_id, action.stop_id, action.direct_id].join('_');

    newState = {...state};
    delete newState[key];
  }

  // 3. Update
  if (action.type === 'SCHEDULE_UPDATE') {
    newState = action.schedules;
  }

  // save to location storage
  localStorage.setItem('schedules', JSON.stringify(newState));

  return newState;
}

export default scheduleReducer;
