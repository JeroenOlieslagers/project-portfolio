import React from 'react';
import {Grid, Checkbox, FormControlLabel, FormHelperText, FormControl, FormGroup} from '@material-ui/core';
import SliderInput from './SliderInput';
import {clip, inputChange, sliderChange, toggleUpdateData, togglePerformanceChart} from '../../actions';
import {GraphicEq, ScatterPlot, Tune} from '@material-ui/icons';
import {connect} from 'react-redux';
import CustomCard from '../CustomCard';

class PoissonConfig extends React.Component {
  handleBlur = (valueName, max, name) => {
    this.props.clip(max, valueName, name);
    this.props.toggleUpdateData(name);
  };

  render() {
    return (
      <CustomCard title={'Graph Configuration'} avatar={<Tune />}>
        <Grid container>
          <Grid item xs={6}>
            <SliderInput
              label={'Lambda'}
              name={'poisson'}
              valueName={'lambda'}
              value={this.props.lambda.poisson}
              inputChange={this.props.inputChange}
              sliderChange={this.props.sliderChange}
              toggleUpdateData={this.props.toggleUpdateData}
              handleBlur={this.handleBlur}
              max={745}
              icon={<GraphicEq />}
            />
          </Grid>
          <Grid item xs={6}>
            <SliderInput
              label={'Samples'}
              name={'poisson'}
              valueName={'samples'}
              value={this.props.samples.poisson}
              inputChange={this.props.inputChange}
              sliderChange={this.props.sliderChange}
              toggleUpdateData={this.props.toggleUpdateData}
              handleBlur={this.handleBlur}
              max={1000000}
              icon={<ScatterPlot />}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset" className={'stats__performance-chart'}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={this.props.performanceChart.poisson} onChange={() => this.props.togglePerformanceChart('poisson')} />
                  }
                  label="Performance Chart"
                />
              </FormGroup>
              <FormHelperText margin="dense">Tick for faster rendering (recommended at high variances)</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </CustomCard>
    );
  }
}

function mapStateToProps(state) {
  return {
    lambda: state.lambda,
    samples: state.samples,
    performanceChart: state.performanceChart
  };
}

const mapDispatchToProps = {
  sliderChange,
  inputChange,
  clip,
  toggleUpdateData,
  togglePerformanceChart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PoissonConfig);
