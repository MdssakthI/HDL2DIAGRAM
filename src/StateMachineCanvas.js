import React, { useState, useEffect, useRef } from 'react';
import { dia, shapes } from 'jointjs';

const StateMachineCanvas = () => {
  const graphRef = useRef(new dia.Graph()); // Persistent graph instance
  const paperRef = useRef(null); // Store paper instance to prevent recreation
  const [selectedStates, setSelectedStates] = useState([]); // Track multiple selected states
  const [condition, setCondition] = useState('');

  useEffect(() => {
    if (!paperRef.current) { // Ensure initialization runs only once
      paperRef.current = new dia.Paper({
        el: document.getElementById('canvas'),
        model: graphRef.current,
        width: 800,
        height: 600,
        gridSize: 10,
        drawGrid: true,
        linkPinning: false,
      });

      // Listen for click events on cells (states)
      paperRef.current.on('cell:pointerdown', (cellView) => {
        if (cellView.model.isElement()) {
          const selectedCell = cellView.model;

          setSelectedStates((prevStates) => {
            const isAlreadySelected = prevStates.includes(selectedCell);

            if (isAlreadySelected) {
              selectedCell.attr('body/fill', 'lightblue'); // Reset color
              return prevStates.filter((state) => state !== selectedCell);
            } else if (prevStates.length < 2) {
              selectedCell.attr('body/fill', 'lightgreen'); // Highlight selection
              return [...prevStates, selectedCell];
            }

            return prevStates; // If max selection reached, do nothing
          });
        }
      });
    }
  }, []); // Empty dependency array ensures this runs only once

  const addStateBox = () => {
    const rect = new shapes.standard.Rectangle();
    const randomX = Math.floor(Math.random() * 600);
    const randomY = Math.floor(Math.random() * 400);

    rect.position(randomX, randomY);
    rect.resize(100, 60);
    rect.attr({
      body: { fill: 'lightblue' },
      label: { text: 'State ' + (graphRef.current.getElements().length + 1), fontSize: 14, fill: 'black' },
    });

    rect.addTo(graphRef.current);
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
    link.labels([{
      position: 0.5,
      attrs: {
        text: {
          text: condition,
          fontSize: 12,
          fill: 'black',
          fontWeight: 'bold',
        },
        rect: {
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1,
          refWidth: '120%',
          refHeight: '120%'
        }
      }
    }]);
    link.attr({ line: { stroke: 'black', strokeWidth: 2 } });
    link.addTo(graphRef.current);
    setCondition('');
    setSelectedStates([]);
    source.attr('body/fill', 'lightblue');
    target.attr('body/fill', 'lightblue');
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

        <input type="text" placeholder="Transition Condition" value={condition} onChange={(e) => setCondition(e.target.value)} />
        <button onClick={addTransition}>Add Transition</button>
      </div>
    </div>
  );
};

export default StateMachineCanvas;