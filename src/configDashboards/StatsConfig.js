import React from 'react';
import {Paper, Slider, Input, Grid, Typography} from '@material-ui/core';
import {BarChart} from '@material-ui/icons';


export default function StatsConfig() {
  const [value, setValue] = React.useState(3);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = event => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
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
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              max={20}
            />
          </Grid>
          <Grid item>
            <Input
              className='slider__input'
              value={(value + 1 % 10) * Math.pow(10, Math.floor(value / 10))}
              margin="dense"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 10,
                min: 0,
                max: 1e6,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </Grid>
      </div>
    </Paper>
  )
}
