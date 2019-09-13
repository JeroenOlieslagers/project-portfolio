import React from 'react';
import {Slider, Input, Grid, Typography} from '@material-ui/core';
import {BarChart} from '@material-ui/icons';
import {logToLin} from '../utils';
import {sliderChange, inputChange, clipMean, toggleUpdateData} from '../actions';
import {connect} from 'react-redux';

class SliderInput extends React.Component {
  handleBlur = () => {
    this.props.clipMean(100000);
    this.props.toggleUpdateData();
  };

  render() {
    return (
      <div className="slider__container">
        <Typography id="input-slider" gutterBottom>
          Mean
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <BarChart />
          </Grid>
          <Grid item xs>
            <Slider
              value={logToLin(this.props.mean)}
              onChange={this.props.sliderChange}
              onChangeCommitted={this.props.toggleUpdateData}
              aria-labelledby="input-slider"
              max={46}
            />
          </Grid>
          <Grid item>
            <Input
              className="slider__input"
              value={this.props.mean}
              margin="dense"
              onChange={this.props.inputChange}
              onBlur={this.handleBlur}
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

function mapStateToProps(state) {
  return {
    mean: state.mean
  };
}

const mapDispatchToProps = {
  sliderChange,
  inputChange,
  clipMean,
  toggleUpdateData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderInput);
