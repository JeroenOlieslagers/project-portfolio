import React from 'react';
import {Slider, Input, Grid, Typography} from '@material-ui/core';
import {logToLin} from '../utils';

export default class SliderInput extends React.Component {
  render() {
    return (
      <div className="slider__container">
        <Typography id="input-slider" gutterBottom>
          {this.props.label}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>{this.props.icon}</Grid>
          <Grid item xs>
            <Slider
              value={logToLin(this.props.value)}
              onChange={(event, newValue) => this.props.sliderChange(event, newValue, this.props.valueName, this.props.name)}
              onChangeCommitted={() => this.props.toggleUpdateData(this.props.name)}
              aria-labelledby="input-slider"
              max={logToLin(this.props.max)}
              className={'slider'}
            />
          </Grid>
          <Grid item>
            <Input
              className="slider__input"
              value={this.props.value}
              margin="dense"
              onChange={event => this.props.inputChange(event, this.props.valueName, this.props.name)}
              onBlur={() => this.props.handleBlur(this.props.valueName, this.props.max, this.props.name)}
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
