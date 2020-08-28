import {AppBar, Slide, Tab, Tabs, useScrollTrigger, TextField, MenuItem, Popover} from '@material-ui/core';
import React from 'react';
import {setTab} from '../actions';
import {connect} from 'react-redux';
import {ArrowDropDown} from '@material-ui/icons';

class NavigationBar extends React.Component {
  constructor() {
    super();
    this.state = {
      statsTab: 'normal',
      neurTab: 'neurInfo',
      open: false
    }
  }

  handleOpen = (event) => {
    event.stopPropagation();
    this.setState({
      anchorEl: event.currentTarget,
      tabId: event.currentTarget.id,
      open: !this.state.open
    });
  };

  changeStatsTab = (event, value) => {
    this.props.setTab(event, value);
    this.handleClose(event);
    this.setState({
      statsTab: value
    })
  };

  changeNeurTab = (event, value) => {
    this.props.setTab(event, value);
    this.handleClose(event);
    this.setState({
      neurTab: value
    })
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      tabId: null,
      open: !this.state.open
    })
  };

  render() {
    return (
      <HideOnScroll>
        <AppBar>
          <Tabs centered value={this.props.selectedTab} onChange={this.props.setTab}>
            <Tab label="home" value={'home'} />
            <Tab classes={{wrapper: 'stats__tab'}} label="Stats" value={this.state.statsTab} id={"stats-tab"} icon={<ArrowDropDown />} onClick={this.handleOpen}/>
            <Tab classes={{wrapper: 'stats__tab'}} label="Theoretical Neuroscience" value={this.state.neurTab} id={"neur-tab"} icon={<ArrowDropDown />} onClick={this.handleOpen}/>
            <Tab label="Ray Tracing" value={'rayTracing'} />
            <Tab label="IPython Notebooks" value={'ipython'} />
          </Tabs>
          <Popover
            open={this.state.open}
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
            <MenuItem className={'stats__menu'} style={{display: this.state.tabId === 'stats-tab' ? 'flex' : 'none'}} onClick={event => this.changeStatsTab(event, 'normal')}>
              Normal
            </MenuItem>
            <MenuItem className={'stats__menu'} style={{display: this.state.tabId === 'stats-tab' ? 'flex' : 'none'}} onClick={event => this.changeStatsTab(event, 'poisson')}>
              Poisson
            </MenuItem>
            <MenuItem className={'stats__menu'} style={{display: this.state.tabId === 'neur-tab' ? 'flex' : 'none'}} onClick={event => this.changeNeurTab(event, 'neurInfo')}>
              Info
            </MenuItem>
            <MenuItem className={'stats__menu'} style={{display: this.state.tabId === 'neur-tab' ? 'flex' : 'none'}} onClick={event => this.changeNeurTab(event, 'chapter1')}>
              Chapter 1
            </MenuItem>
            <MenuItem className={'stats__menu'} style={{display: this.state.tabId === 'neur-tab' ? 'flex' : 'none'}} onClick={event => this.changeNeurTab(event, 'neurExt')}>
              Extensions
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
