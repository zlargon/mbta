const defaultUI = {
  panel: 0,
  drawer: false,
  drawer_collapse: [true, true, true]
}

const uiReducer = (state = defaultUI, action) => {

  if (action.type === 'UI_PANEL_CHANGE') {
    return {
      ...state,
      panel: action.panel
    };
  }

  if (action.type === 'UI_DRAWER_TOGGLE') {
    return {
      ...state,
      drawer: !state.drawer
    }
  }

  if (action.type === 'UI_DRAWER_COLLAPSE') {
    const collapse = [...state.drawer_collapse];
    collapse[action.index] = !collapse[action.index];

    return {
      ...state,
      drawer_collapse: collapse
    }
  }

  return state;
}

export default uiReducer;
