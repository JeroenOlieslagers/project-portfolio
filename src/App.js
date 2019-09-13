import React from 'react';
import logo from './logo.svg';
import './App.css';
import Stats from './stats';
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import {Restore, Favorite, LocationOn} from '@material-ui/icons';
import {Switch, Route} from 'react-router-dom';

function App() {
  const Header = () => {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Data Visualisation
        <BottomNavigation>
          <BottomNavigationAction label="Stats" href="/stats" icon={<Restore />} />
          <BottomNavigationAction label="Spike Train" href="/" icon={<Favorite />} />
          <BottomNavigationAction label="Home" href="/" icon={<LocationOn />} />
        </BottomNavigation>
      </header>
    );
  };

  return (
    <Switch>
      <Route exact path="/" component={Header} />
      <Route path="/stats" component={Stats} />
    </Switch>
  );
}

export default App;
