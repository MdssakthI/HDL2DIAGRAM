import React, { useState, useEffect, useRef } from 'react';
import { dia, shapes } from 'jointjs';

const StateMachineCanvas = () => {
  const graphRef = useRef(new dia.Graph()); // Persistent graph instance
  const paperRef = useRef(null); // Store paper instance to prevent recreation
  const [selectedStates, setSelectedStates] = useState([]); // Track multiple selected states
  const [condition, setCondition] = useState('');
  const [shapeType, setShapeType] = useState('rectangle'); // New state to track selected shape

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
    let shape;
    const randomX = Math.floor(Math.random() * 600);
    const randomY = Math.floor(Math.random() * 400);

    // Create the shape based on the selected type
    if (shapeType === 'rectangle') {
      shape = new shapes.standard.Rectangle();
      shape.resize(100, 60); // Rectangle size
    } else if (shapeType === 'circle') {
      shape = new shapes.standard.Ellipse(); // Use Ellipse for circle
      shape.resize(80, 80); // Circle size
    }

    shape.position(randomX, randomY);
    shape.attr({
      body: { fill: 'lightblue' },
      label: { text: 'State ' + (graphRef.current.getElements().length + 1), fontSize: 14, fill: 'black' },
    });

    shape.addTo(graphRef.current);
  };

  const addTransition = () => {
    if (selectedStates.length < 1 || selectedStates.length > 2) {
      alert('Please select one or two states to create a transition!');
      return;
    }

    const [source, target] = selectedStates.length === 2 ? selectedStates : [selectedStates[0], selectedStates[0]];

    const link = new shapes.standard.Link();

    // Define anchors as specific points on the rectangle (e.g., left, right, top, bottom)
    link.source(source, {
      anchor: { name: 'perpendicular' }, // Makes the link start at a perpendicular point to the shape
      offset: { x: 0, y: 0 },
    });
    link.target(target, {
      anchor: { name: 'perpendicular' }, // Makes the link end at a perpendicular point to the shape
      offset: { x: 0, y: 0 },
    });

    link.attr({
      line: { stroke: 'black', strokeWidth: 2 },
    });

    if (condition.trim()) {
      link.appendLabel({
        attrs: {
          text: {
            text: condition,
            fontSize: 12,
            fill: 'black',
            fontWeight: 'bold',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
          },
        },
        position: {
          distance: 0.5,
        },
      });
    }

    link.router('manhattan');
    link.addTo(graphRef.current);
    setCondition('');
    setSelectedStates([]);
    source.attr('body/fill', 'lightblue');
    if (target !== source) {
      target.attr('body/fill', 'lightblue');
    }
  };

  return (
    <div>
      <h3>State Machine Diagram</h3>
      <div id="canvas" style={{ border: '1px solid black' }}></div>

      <button onClick={addStateBox}>Add New State</button>

      {/* Shape Selection UI */}
      <div>
        <h4>Select State Shape</h4>
        <label>
          <input
            type="radio"
            name="shapeType"
            value="rectangle"
            checked={shapeType === 'rectangle'}
            onChange={() => setShapeType('rectangle')}
          />
          Rectangle
        </label>
        <label>
          <input
            type="radio"
            name="shapeType"
            value="circle"
            checked={shapeType === 'circle'}
            onChange={() => setShapeType('circle')}
          />
          Circle
        </label>
      </div>

      <div>
        <h4>Create Transition</h4>
        {selectedStates.length > 0 && (
          <div>
            <h5>Selected States for Transition</h5>
            <p>
              {selectedStates[0]?.attr('label/text')} 
              {selectedStates.length === 2 ? ` → ${selectedStates[1]?.attr('label/text')}` : ' (self-loop)'}
            </p>
          </div>
        )}

        <input type="text" placeholder="Transition Condition (optional)" value={condition} onChange={(e) => setCondition(e.target.value)} />
        <button onClick={addTransition}>Add Transition</button>
      </div>
    </div>
  );
};

export default StateMachineCanvas;
