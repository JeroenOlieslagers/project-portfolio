import {AppBar, Slide, Tab, Tabs, useScrollTrigger, TextField} from '@material-ui/core';
import React from 'react';
import {setTab} from '../actions';
import {connect} from 'react-redux';

class NavigationBar extends React.Component {
  render() {
    return (
      <HideOnScroll>
        <AppBar>
          <Tabs centered value={this.props.selectedTab} onChange={this.props.setTab}>
            <Tab label="home" value={'home'} />
            <Tab label="Stats" value={'stats'} />
            <Tab label="Spike Trains" value={'spikeTrains'} />
          </Tabs>
        </AppBar>
      </HideOnScroll>
    );
  }
}

function HideOnScroll(props) {
  const {children, window} = props;
  const trigger = useScrollTrigger({target: window ? window() : undefined});

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function mapStateToProps(state) {
  return {
    selectedTab: state.selectedTab
  };
}

const mapDispatchToProps = {
  setTab
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationBar);
