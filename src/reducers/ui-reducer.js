const defaultUI = {
  panel: 0,
  drawer: false
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

  return state;
}

export default uiReducer;
