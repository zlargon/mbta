const defaultUI = {
  panel: 0,
  drawer: false,
  drawer_collapse: [true, true, true],
  search_collapse: {}, // { "Blue": false, "Orange": false, "Red": false, ...}
  search_dialog: false
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

  if (action.type === 'UI_SEARCH_COLLAPSE') {
    const collapse = {...state.search_collapse};
    collapse[action.routeId] = !collapse[action.routeId];

    return {
      ...state,
      search_collapse: collapse
    }
  }

  if (action.type === 'UI_SEARCH_DIALOG') {
    return {
      ...state,
      search_dialog: action.open
    }
  }

  return state;
}

export default uiReducer;
