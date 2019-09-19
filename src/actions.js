export const SLIDER_CHANGE = 'SLIDER_CHANGE';
export const INPUT_CHANGE = 'INPUT_CHANGE';
export const CLIP = 'CLIP';
export const TOGGLE_UPDATE_DATA = 'TOGGLE_UPDATE_DATA';
export const SET_TAB = 'SET_TAB';
export const TOGGLE_PERFORMANCE_CHART = 'TOGGLE_PERFORMANCE_CHART';

export const sliderChange = (event, newValue, value, name) => ({type: SLIDER_CHANGE, newValue: newValue, value: value, event: event, name: name});
export const inputChange = (event, value, name) => ({type: INPUT_CHANGE, event: event, value: value, name: name});
export const clip = (max, value, name) => ({type: CLIP, max: max, value: value, name: name});
export const toggleUpdateData = name => ({type: TOGGLE_UPDATE_DATA, name: name});
export const setTab = (event, value) => ({type: SET_TAB, value: value});
export const togglePerformanceChart = name => ({type: TOGGLE_PERFORMANCE_CHART, name: name});
