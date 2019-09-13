import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import produce from 'immer';
import {BrowserRouter} from 'react-router-dom';
import {linToLog} from './utils';

const initialState = {
  mean: 100,
  updateData: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SLIDER_CHANGE':
      return {
        ...state,
        mean: linToLog(action.newValue)
      };
    case 'INPUT_CHANGE':
      return {
        ...state,
        mean: action.event.target.value === '' ? '' : Number(action.event.target.value)
      };
    case 'CLIP_MEAN':
      if (state.mean > action.max) {
        return {
          ...state,
          mean: action.max
        };
      } else if (state.mean < 0) {
        return {
          ...state,
          mean: 0
        };
      } else {
        return state;
      }
    case 'TOGGLE_UPDATE_DATA':
      return {
        ...state,
        updateData: !state.updateData
      };
    default:
      return state;
  }
}
const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
