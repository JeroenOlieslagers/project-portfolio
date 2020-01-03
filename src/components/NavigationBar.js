import {AppBar, Slide, Tab, Tabs, useScrollTrigger, TextField, MenuItem, Popover} from '@material-ui/core';
import React from 'react';
import {setTab} from '../actions';
import {connect} from 'react-redux';
import {ArrowDropDown} from '@material-ui/icons';

class NavigationBar extends React.Component {
  constructor() {
    super();
    this.state = {
      statsTab: 'normal'
    }
  }

  handleOpen = (event) => {
    event.stopPropagation();
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  changeStatsTab = (event, value) => {
    this.props.setTab(event, value);
    this.handleClose(event);
    this.setState({
      statsTab: value
    })
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    })
  };

  render() {
    let open = Boolean(this.state.anchorEl);
    return (
      <HideOnScroll>
        <AppBar>
          <Tabs centered value={this.props.selectedTab} onChange={this.props.setTab}>
            <Tab label="home" value={'home'} />
            <Tab classes={{wrapper: 'stats__tab'}} label="Stats" value={this.state.statsTab} icon={<ArrowDropDown />} onClick={this.handleOpen}/>
            <Tab label="Spike Trains" value={'spikeTrains'} />
            <Tab label="IPython Notebooks" value={'ipython'} />
          </Tabs>
          <Popover
            open={open}
            anchorEl={this.state.anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left"
            }}
          >
            <MenuItem className={'stats__menu'} onClick={event => this.changeStatsTab(event, 'normal')}>
              Normal
            </MenuItem>
            <MenuItem className={'stats__menu'} onClick={event => this.changeStatsTab(event, 'poisson')}>
              Poisson
            </MenuItem>
          </Popover>
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
