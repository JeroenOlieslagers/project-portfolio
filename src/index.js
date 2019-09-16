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
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const initialState = {
  mean: 100,
  stDev: 10,
  samples: 1000,
  updateData: false,
  selectedTab: 'home'
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SLIDER_CHANGE':
      return produce(state, draft => {
        draft[action.value] = linToLog(action.newValue)
      });
    case 'INPUT_CHANGE':
      return produce(state, draft => {
        draft[action.value] = action.event.target.value === '' ? '' : Number(action.event.target.value)
      });
    case 'CLIP_MEAN':
      if (state[action.value] > action.max) {
        return produce(state, draft => {
          draft[action.value] = action.max
        })
      } else if (state[action.value] < 0) {
        return produce(state, draft => {
          draft[action.value] = 0
        })
      } else {
        return state;
      }
    case 'TOGGLE_UPDATE_DATA':
      return {
        ...state,
        updateData: !state.updateData
      };
    case 'SET_TAB':
      return {
        ...state,
        selectedTab: action.value
      };
    default:
      return state;
  }
}
const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
