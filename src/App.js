import React from 'react';
import logo from './logo.svg';
import './App.css';
import Stats from './stats';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Data Visualisation
      </header>
      <body>
        <Stats />
      </body>
    </div>
  );
}

export default App;
