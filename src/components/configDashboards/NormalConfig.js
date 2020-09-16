import React from 'react';
import {Grid, Checkbox, FormControlLabel, FormHelperText, FormControl, FormGroup} from '@material-ui/core';
import SliderInput from './SliderInput';
import {clip, inputChange, sliderChange, toggleUpdateData, togglePerformanceChart} from '../../actions';
import {GraphicEq, ScatterPlot, BlurOn, Tune} from '@material-ui/icons';
import {connect} from 'react-redux';
import CustomCard from '../CustomCard';

class NormalConfig extends React.Component {
  handleBlur = (valueName, max, name) => {
    this.props.clip(max, valueName, name);
    this.props.toggleUpdateData(name);
  };

  render() {
    return (
      <CustomCard title={'Graph Configuration'} avatar={<Tune />} expanded={true}>
        <Grid container>
          <Grid item xs={6}>
            <SliderInput
              label={'Mean'}
              name={'normal'}
              valueName={'mean'}
              value={this.props.mean.normal}
              inputChange={this.props.inputChange}
              sliderChange={this.props.sliderChange}
              toggleUpdateData={this.props.toggleUpdateData}
              handleBlur={this.handleBlur}
              max={100000}
              icon={<GraphicEq />}
            />
          </Grid>
          <Grid item xs={6}>
            <SliderInput
              label={'Standard Deviation'}
              name={'normal'}
              valueName={'stDev'}
              value={this.props.stDev.normal}
              inputChange={this.props.inputChange}
              sliderChange={this.props.sliderChange}
              toggleUpdateData={this.props.toggleUpdateData}
              handleBlur={this.handleBlur}
              max={1000}
              icon={<BlurOn />}
            />
          </Grid>
          <Grid item xs={6}>
            <SliderInput
              label={'Samples'}
              name={'normal'}
              valueName={'samples'}
              value={this.props.samples.normal}
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
                    <Checkbox checked={this.props.performanceChart.normal} onChange={() => this.props.togglePerformanceChart('normal')} />
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
    mean: state.mean,
    stDev: state.stDev,
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
)(NormalConfig);
