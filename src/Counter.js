import React from 'react';
import {connect} from 'react-redux';
import {increment, decrement} from './actions';
import {withRouter} from 'react-router-dom';
import Icon from '@material-ui/core/Icon';


class Counter extends React.Component {
  render() {
    return (
      <div className="counter">
        <h2>Counter</h2>
        <Icon>add</Icon>
        <div>
          <button onClick={this.props.decrement}>-</button>
          <span className="count">{
            this.props.count
          }</span>
          <button onClick={this.props.increment}>+</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    count: state.count
  };
}

const mapDispatchToProps = {
  increment,
  decrement
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
