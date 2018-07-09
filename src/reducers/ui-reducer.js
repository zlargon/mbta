const uiReducer = (state = { panel: 0 }, action) => {

  if (action.type === 'UI_PANEL_CHANGE') {
    return {
      ...state,
      panel: action.panel
    };
  }

  return state;
}

export default uiReducer;
