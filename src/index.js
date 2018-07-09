import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// Redux
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

// Reducer
import uiReducer from './reducers/ui-reducer';
import languageReducer from './reducers/language-reducer';
import timeReducer from './reducers/time-reducer';
const reducer = combineReducers({
  lang: languageReducer,
  ui: uiReducer,
  currentTime: timeReducer
});

// Store
const store = createStore(reducer);

// Update Time every 0.5 sec
setInterval(() => {
  store.dispatch({ type: 'TIME_UPDATE' });
}, 500)

// React Render
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
