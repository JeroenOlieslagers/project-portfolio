import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import produce from 'immer';
import {BrowserRouter} from 'react-router-dom';
import {linToLog} from './components/utils';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      main: '#FFFFFF'
    }
  }
});

const initialState = {
  mean: {
    normal: 100,
    poisson: 100
  },
  stDev: {
    normal: 10,
    poisson: 10
  },
  lambda : {
    stats: 5
  },
  samples: {
    normal: 1000,
    poisson: 1000
  },
  updateData: {
    normal: false,
    poisson: false
  },
  performanceChart: {
    normal: false,
    poisson: false
  },
  selectedTab: 'home',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SLIDER_CHANGE':
      return produce(state, draft => {
        draft[action.value][action.name] = linToLog(action.newValue);
      });
    case 'INPUT_CHANGE':
      return produce(state, draft => {
        draft[action.value][action.name] = action.event.target.value === '' ? '' : Number(action.event.target.value);
      });
    case 'CLIP':
      if (state[action.value][action.name] > action.max) {
        return produce(state, draft => {
          draft[action.value][action.name] = action.max;
        });
      } else if (state[action.value][action.name] < 0) {
        return produce(state, draft => {
          draft[action.value][action.name] = 0;
        });
      } else {
        return state;
      }
    case 'TOGGLE_UPDATE_DATA':
      return produce(state, draft => {
        draft.updateData[action.name] = !state.updateData[action.name];
      });
    case 'TOGGLE_PERFORMANCE_CHART':
      return produce(state, draft => {
        draft.updateData[action.name] = !state.updateData[action.name];
        draft.performanceChart[action.name] = !state.performanceChart[action.name];
      });
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
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
