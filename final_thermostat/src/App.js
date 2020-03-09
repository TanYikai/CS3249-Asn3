import React, { Component } from 'react';
import './App.css';
import ViewModel from './ViewModel';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ViewModel/>
        </header>
      </div>
    );
  }
}

export default App;
