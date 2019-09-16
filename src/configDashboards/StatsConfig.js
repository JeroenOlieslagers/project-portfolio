import React from 'react';
import {Grid} from '@material-ui/core';
import SliderInput from './SliderInput';
import {clipMean, inputChange, sliderChange, toggleUpdateData} from '../actions';
import {GraphicEq, ScatterPlot, BlurOn, Tune} from '@material-ui/icons';
import {connect} from 'react-redux';
import CustomCard from '../CustomCard'

class StatsConfig extends React.Component {
  handleBlur = (valueName, max) => {
    this.props.clipMean(max, valueName);
    this.props.toggleUpdateData();
  };

  render() {
    return (
      <CustomCard className={'stats__config-card'} title={'Graph Configuration'} avatar={<Tune />}>
        <Grid container>
          <Grid item xs={6}>
            <SliderInput
              label={'Mean'}
              valueName={'mean'}
              value={this.props.mean}
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
              valueName={'stDev'}
              value={this.props.stDev}
              inputChange={this.props.inputChange}
              sliderChange={this.props.sliderChange}
              toggleUpdateData={this.props.toggleUpdateData}
              handleBlur={this.handleBlur}
              max={10000}
              icon={<BlurOn />}
            />
          </Grid>
          <Grid item xs={6}>
            <SliderInput
              label={'Samples'}
              valueName={'samples'}
              value={this.props.samples}
              inputChange={this.props.inputChange}
              sliderChange={this.props.sliderChange}
              toggleUpdateData={this.props.toggleUpdateData}
              handleBlur={this.handleBlur}
              max={1000000}
              icon={<ScatterPlot />}
            />
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
    samples: state.samples
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
)(StatsConfig);

