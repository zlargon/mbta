const defaultState = localStorage.getItem('lang') || 'en';

const languageReducer = (state = defaultState, action) => {

  if (action.type === 'LANG_CHANGE') {
    localStorage.setItem('lang', action.lang);  // save to localStorage
    return action.lang;
  }

  return state;
}

export default languageReducer;
