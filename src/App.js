import React from 'react';
import logo from './logo.svg';
import './App.css';
import Stats from './stats';
import {Switch, Route} from 'react-router-dom';
import NavigationBar from './NavigationBar';
import {connect} from 'react-redux';

class App extends React.Component {
  render() {
    return (
      <div>
        <NavigationBar/>
        <div className={this.props.selectedTab === 'home' ? '' : 'invisible'}>
          <header className={'App-header'}>
            <img src={logo} className="App-logo" alt="logo"/>
            Data Visualisation
          </header>
        </div>
        <div className={this.props.selectedTab === 'stats' ? '' : 'invisible'}>
          <Stats/>
        </div>
      </div>
    )
  }

  // return (
  //   <Switch>
  //     <Route exact path="/" component={Header} />
  //     <Route path="/stats" component={Stats} />
  //   </Switch>
  // );
}

function mapStateToProps(state) {
  return {
    selectedTab: state.selectedTab
  };
}

export default connect(
  mapStateToProps
)(App);
