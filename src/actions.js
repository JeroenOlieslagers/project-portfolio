export const SLIDER_CHANGE = 'SLIDER_CHANGE';
export const INPUT_CHANGE = 'INPUT_CHANGE';
export const CLIP_MEAN = 'CLIP_MEAN';
export const TOGGLE_UPDATE_DATA = 'TOGGLE_UPDATE_DATA';
export const SET_TAB = 'SET_TAB';

export const sliderChange = (event, newValue, value) => ({type: SLIDER_CHANGE, newValue: newValue, value: value});
export const inputChange = (event, value) => ({type: INPUT_CHANGE, event: event, value: value});
export const clipMean = (max, value) => ({type: CLIP_MEAN, max: max, value: value});
export const toggleUpdateData = () => ({type: TOGGLE_UPDATE_DATA});
export const setTab = (event, value) => ({type: SET_TAB, value: value});
