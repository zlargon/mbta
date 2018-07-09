import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// Redux
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

// Reducer
import languageReducer from './reducers/language-reducer';
import uiReducer from './reducers/ui-reducer';
const reducer = combineReducers({
  lang: languageReducer,
  ui: uiReducer
});

// Store
const store = createStore(reducer, {
  lang: localStorage.getItem('lang') || 'en'  // get lang from localStorage
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
