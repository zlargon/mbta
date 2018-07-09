const defaultUI = {
  panel: 0,
  menu: false,
  menu_collapse: [true, true, true],
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

  if (action.type === 'UI_MENU_TOGGLE') {
    return {
      ...state,
      menu: !state.menu
    }
  }

  if (action.type === 'UI_MENU_COLLAPSE') {
    const collapse = [...state.menu_collapse];
    collapse[action.index] = !collapse[action.index];

    return {
      ...state,
      menu_collapse: collapse
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
