import React from 'react';
import logo from './logo.svg';
import './App.css';
import Stats from './stats';
import {Switch, Route} from 'react-router-dom';
import NavigationBar from './NavigationBar';

function App() {
  const Header = () => {
    return (
      <header className="App-header">
        <NavigationBar/>
        <img src={logo} className="App-logo" alt="logo" />
        Data Visualisation
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
