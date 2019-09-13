export const SLIDER_CHANGE = 'SLIDER_CHANGE';
export const INPUT_CHANGE = 'INPUT_CHANGE';
export const CLIP_MEAN = 'CLIP_MEAN';
export const TOGGLE_UPDATE_DATA = 'TOGGLE_UPDATE_DATA';

export const sliderChange = (event, newValue) => ({type: SLIDER_CHANGE, newValue: newValue});
export const inputChange = event => ({type: INPUT_CHANGE, event: event});
export const clipMean = max => ({type: CLIP_MEAN, max: max});
export const toggleUpdateData = () => ({type: TOGGLE_UPDATE_DATA});
