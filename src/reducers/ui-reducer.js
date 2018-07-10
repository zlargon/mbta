const defultState = {
  panel: Number.parseInt(localStorage.getItem('panel') || '0', 10),

  // { "Blue": false, "Orange": false, "Red": false, ...}
  search_collapse: JSON.parse(localStorage.getItem('search_collapse') || '{}'),

  menu: false,
  menu_collapse: [true, true, true],
  search_dialog: false,
  schedule_loading: {}
};

const uiReducer = (state = defultState, action) => {
  let newState = state;

  if (action.type === 'UI_PANEL_CHANGE') {
    newState = {
      ...state,
      panel: action.panel
    };
  }

  if (action.type === 'UI_MENU_TOGGLE') {
    newState = {
      ...state,
      menu: !state.menu
    }
  }

  if (action.type === 'UI_MENU_COLLAPSE') {
    const collapse = [...state.menu_collapse];
    collapse[action.index] = !collapse[action.index];

    newState = {
      ...state,
      menu_collapse: collapse
    }
  }

  if (action.type === 'UI_SEARCH_COLLAPSE') {
    const collapse = {...state.search_collapse};
    collapse[action.routeId] = !collapse[action.routeId];

    newState = {
      ...state,
      search_collapse: collapse
    }
  }

  if (action.type === 'UI_SEARCH_DIALOG') {
    newState = {
      ...state,
      search_dialog: action.open
    }
  }

  if (action.type === 'UI_SCHEDULE_LOADING_ADD') {
    const loading = {
      ...state.schedule_loading,
    };
    loading[action.schedule] = true;

    newState = {
      ...state,
      schedule_loading: loading
    }
  }

  if (action.type === 'UI_SCHEDULE_LOADING_REMOVE') {
    const loading = {
      ...state.schedule_loading
    };
    delete loading[action.schedule];

    newState = {
      ...state,
      schedule_loading: loading
    }
  }

  // save to location storage
  localStorage.setItem('panel', newState.panel);
  localStorage.setItem('search_collapse', JSON.stringify(newState.search_collapse));

  return newState;
}

export default uiReducer;
