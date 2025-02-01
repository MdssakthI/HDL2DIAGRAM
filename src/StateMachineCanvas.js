import React, { useState, useEffect } from 'react';
import { dia, shapes } from 'jointjs';

const StateMachineCanvas = () => {
  const [graph, setGraph] = useState(null);
  const [selectedStates, setSelectedStates] = useState([]); // Track multiple selected states
  const [condition, setCondition] = useState('');
  const [stateAction, setStateAction] = useState('');
  const [stateName, setStateName] = useState('');

  useEffect(() => {
    const graphInstance = new dia.Graph();
    setGraph(graphInstance); // Set graph to state

    // Create paper (the rendering context for the canvas)
    const paperInstance = new dia.Paper({
      el: document.getElementById('canvas'),
      model: graphInstance,
      width: 800,
      height: 600,
      gridSize: 10,
      drawGrid: true,
      linkPinning: false,
    });

    // Listen for click events on cells (states)
    paperInstance.on('cell:pointerdown', (cellView) => {
      if (cellView.model.isElement()) {
        const selectedCell = cellView.model;

        // Make sure to only select a state if it's not already in the selectedStates
        const isAlreadySelected = selectedStates.includes(selectedCell);
        if (isAlreadySelected) {
          // If already selected, remove it
          setSelectedStates(selectedStates.filter((state) => state !== selectedCell));
          selectedCell.attr('body/fill', 'lightblue'); // Reset state color
        } else {
          // Add to selected states if the limit of 2 is not reached
          if (selectedStates.length < 2) {
            setSelectedStates((prevStates) => [...prevStates, selectedCell]);
            selectedCell.attr('body/fill', 'lightgreen'); // Highlight selected state
          }
        }
      }
    });

  }, [selectedStates]);

  const addStateBox = () => {
    const rect = new shapes.standard.Rectangle();
    const randomX = Math.floor(Math.random() * 600);
    const randomY = Math.floor(Math.random() * 400);

    rect.position(randomX, randomY);
    rect.resize(100, 60); // Adjust size for both name and action
    rect.attr({
      body: {
        fill: 'lightblue',
      },
      label: {
        text: stateName || 'State ' + (graph.getElements().length + 1),
        fontSize: 14,
        fill: 'black',
      },
      action: { // New attribute for state action (output)
        text: stateAction,
        fontSize: 12,
        fill: 'black',
        y: 30, // Position action below state name
      },
    });

    rect.addTo(graph);
  };

  const addTransition = () => {
    if (selectedStates.length !== 2 || !condition) {
      alert('Please select two states and provide a condition!');
      return;
    }

    const [source, target] = selectedStates;

    const link = new shapes.standard.Link();
    link.source(source);
    link.target(target);
    link.attr({
      line: {
        stroke: 'black',
        strokeWidth: 2,
      },
      label: {
        text: condition,
        fontSize: 12,
        fill: 'black',
        fontWeight: 'bold', // Make condition stand out more
        ref: 'line', // Position label relative to the line (transition arrow)
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
      },
    });
    link.addTo(graph);
    setCondition('');
    setSelectedStates([]); // Reset selection after creating transition
    source.attr('body/fill', 'lightblue'); // Reset source state color
    target.attr('body/fill', 'lightblue'); // Reset target state color
  };

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  const handleStateActionChange = (e) => {
    setStateAction(e.target.value);
  };

  return (
    <div>
      <h3>State Machine Diagram</h3>
      <div id="canvas" style={{ border: '1px solid black' }}></div>

      <button onClick={addStateBox}>Add New State</button>

      <div>
        <h4>Create Transition</h4>
        {selectedStates.length === 2 && (
          <div>
            <h5>Selected States for Transition</h5>
            <p>{selectedStates[0]?.attr('label/text')} &rarr; {selectedStates[1]?.attr('label/text')}</p>
          </div>
        )}

        <input
          type="text"
          placeholder="Transition Condition (e.g., `input_signal == 1`)"
          value={condition}
          onChange={handleConditionChange}
        />

        <button onClick={addTransition}>Add Transition</button>
      </div>

      {selectedStates.length === 1 && (
        <div>
          <h4>Selected State: {selectedStates[0]?.attr('label/text')}</h4>
          <label>
            State Name (e.g., `STATE_IDLE`):
            <input
              type="text"
              placeholder="State Name"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
          </label>

          <label>
            State Action (e.g., `output_signal = 1`):
            <input
              type="text"
              placeholder="State Action"
              value={stateAction}
              onChange={handleStateActionChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default StateMachineCanvas;
