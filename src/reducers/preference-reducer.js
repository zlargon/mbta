const defaultState = {
  max_schedule_number: Number.parseInt(localStorage.getItem('max_schedule_number') || '3', 10)
};

const preferenceReducer = (state = defaultState, action) => {
  let newState = state;

  if (action.type === 'MAX_SCHEDULE_NUM') {

    newState = {
      ...state,
      max_schedule_number: action.number
    }
  }

  // save to location storage
  localStorage.setItem('max_schedule_number', newState.max_schedule_number);

  return newState;
}

export default preferenceReducer;
