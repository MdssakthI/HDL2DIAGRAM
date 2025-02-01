// src/App.js
import React from 'react';
import './App.css';
import StateMachineCanvas from './StateMachineCanvas';

const App = () => {
  return (
    <div className="App">
      <h1>LLMinLogic: State Machine Diagram</h1>
      <StateMachineCanvas />
      <div>
        <button>Generate Verilog Code</button>
      </div>
      <div>
        <h3>Generated Code</h3>
        <textarea rows="10" cols="80" placeholder="Generated Verilog code will appear here..."></textarea>
      </div>
    </div>
  );
};

export default App;
