import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Switch, Route} from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import {connect} from 'react-redux';
import Normal from './Normal';
import Poisson from './Poisson';
import Chapter1 from './neur/chapter1';
import IPython from './ipython';
import RayTracing from './rayTracing';
import NeurInfo from './neur/neurInfo';
import NeurExt from './neur/extensions';

class App extends React.Component {
  render() {
    return (
      <div>
        <NavigationBar />
        <div className={this.props.selectedTab === 'home' ? '' : 'invisible'}>
          <header className={'App-header'}>
            <img src={logo} className="App-logo" alt="logo" />
            Data Visualisation
          </header>
        </div>
        <div className={this.props.selectedTab === 'normal' ? '' : 'invisible'}>
          <Normal />
        </div>
        <div className={this.props.selectedTab === 'poisson' ? '' : 'invisible'}>
          <Poisson />
        </div>
        <div className={this.props.selectedTab === 'neurInfo' ? '' : 'invisible'}>
          <NeurInfo />
        </div>
        <div className={this.props.selectedTab === 'chapter1' ? '' : 'invisible'}>
          <Chapter1 />
        </div>
        <div className={this.props.selectedTab === 'neurExt' ? '' : 'invisible'}>
          <NeurExt />
        </div>
        <div className={this.props.selectedTab === 'rayTracing' ? '' : 'invisible'}>
          <RayTracing />
        </div>
        <div className={this.props.selectedTab === 'ipython' ? '' : 'invisible'}>
          <IPython />
        </div>
      </div>
    );
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

export default connect(mapStateToProps)(App);
