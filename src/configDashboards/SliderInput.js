import React from 'react';
import {Slider, Input, Grid, Typography} from '@material-ui/core';
import {BarChart} from '@material-ui/icons';
import {logToLin} from '../utils';

export default class SliderInput extends React.Component {
  render() {
    return (
      <div className="slider__container">
        <Typography id="input-slider" gutterBottom>
          {this.props.label}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <BarChart />
          </Grid>
          <Grid item xs>
            <Slider
              value={logToLin(this.props.value)}
              onChange={(event, newValue) => this.props.sliderChange(event, newValue, this.props.valueName)}
              onChangeCommitted={this.props.toggleUpdateData}
              aria-labelledby="input-slider"
              max={46}
            />
          </Grid>
          <Grid item>
            <Input
              className="slider__input"
              value={this.props.value}
              margin="dense"
              onChange={(event) => this.props.inputChange(event, this.props.valueName)}
              onBlur={() => this.props.handleBlur(this.props.valueName)}
              inputProps={{
                'aria-labelledby': 'input-slider'
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}
