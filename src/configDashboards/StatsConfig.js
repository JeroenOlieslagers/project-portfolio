import React from 'react';
import {Paper, Slider, Input, Grid, Typography} from '@material-ui/core';
import {BarChart} from '@material-ui/icons';


export default function StatsConfig() {
  const [value, setValue] = React.useState(10);
  const [sliderValue, setSliderValue] = React.useState(10);

  const handleSliderChange = (event, newValue) => {
    setValue(linToLog(newValue));
    setSliderValue(newValue);
  };

  const handleInputChange = event => {
    setSliderValue(event.target.value === '' ? '' : logToLin(Number(event.target.value)));
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100000) {
      setValue(100000);
    }
  };

  const linToLog = x => {
    const y = Math.floor((x + Math.floor(x / 10)) / 10);
    return ((x + y) % 10) * Math.pow(10, y);
  };

  const logToLin = x => {
    const y = Math.floor((x + Math.floor(x / 10)) / 10);
    return ((x + y) % 10) * Math.pow(10, y);
  };

  return (
    <Paper className='chart__container'>
      <div className='slider__container'>
        <Typography id="input-slider" gutterBottom>
          Mean
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <BarChart />
          </Grid>
          <Grid item xs>
            <Slider
              value={typeof sliderValue === 'number' ? sliderValue : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              max={46}
            />
          </Grid>
          <Grid item>
            <Input
              className='slider__input'
              value={value}
              margin="dense"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </Grid>
      </div>
    </Paper>
  )
}
