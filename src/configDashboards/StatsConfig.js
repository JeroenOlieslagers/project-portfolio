import React from 'react';
import {Paper} from '@material-ui/core';
import SliderInput from './SliderInput';
import {clipMean, inputChange, sliderChange, toggleUpdateData} from '../actions';
import {connect} from 'react-redux';


class StatsConfig extends React.Component {
  handleBlur = (valueName) => {
    this.props.clipMean(100000, valueName);
    this.props.toggleUpdateData();
  };

  render() {
    return (
      <Paper className='stats__config'>
        <SliderInput
          label={'Mean'}
          valueName={'mean'}
          value={this.props.mean}
          inputChange={this.props.inputChange}
          sliderChange={this.props.sliderChange}
          toggleUpdateData={this.props.toggleUpdateData}
          handleBlur={this.handleBlur}
        />
        <SliderInput
          label={'Standard Deviation'}
          valueName={'stDev'}
          value={this.props.stDev}
          inputChange={this.props.inputChange}
          sliderChange={this.props.sliderChange}
          toggleUpdateData={this.props.toggleUpdateData}
          handleBlur={this.handleBlur}
        />
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    mean: state.mean,
    stDev: state.stDev
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

