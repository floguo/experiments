import React, { useState, useEffect } from 'react';
import { parsePathData } from 'svg-path-parser';

const Marquee = ({ svgPath, rows = 40, cols = 80 }) => {
  const [activeIndices, setActiveIndices] = useState(new Set());
  const [coordinates, setCoordinates] = useState([]);

  const letterCoordinates = [
    // f 
    [22,20], [21,20], [20,20], [19,20], [18,20], [17,20], [16,20], [15,20],
    [15,21], [15,22], [15,23],
    [18,19], [18,20], [18,21],
    
    // l
    [15,27], [16,27], [17,27], [18,27], [19,27], [20,27], [21,27], [22,27], [22,28],
    
    // o 
    [19,32], [18,33], [18,34], [18,35], [19,36], [20,36], [21,36], [22,35], [22,34], [22,33], [21,32], [20,32], [19,32],

    // g 
    [19,40], [18,41], [18,42], [18,43], [19,44], [20,44], [21,44], [22,43], [22,42], [22,41], [21,40], [20,40], [19,40],
    [22,44], [23,44], [24,43], [24,42],

    // u 
    [18,48], [19,48], [20,48], [21,48], [22,48], [23,49], [23,50], [22,51], [21,51], [20,51], [19,51], [18,51],

    // o (aligned with baseline)
    [19,55], [18,56], [18,57], [18,58], [19,59], [20,59], [21,59], [22,58], [22,57], [22,56], [21,55], [20,55], [19,55]
  ];

  useEffect(() => {
    let currentIndex = 0;

    const animationInterval = setInterval(() => {
      if (currentIndex < letterCoordinates.length) {
        const [row, col] = letterCoordinates[currentIndex];
        setActiveIndices(prev => {
          const newSet = new Set(prev);
          newSet.add(`${row}-${col}`);
          return newSet;
        });
        currentIndex++;
      } else {
        clearInterval(animationInterval);
      }
    }, 25);

    return () => clearInterval(animationInterval);
  }, []);

  // Flickering effect
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      setActiveIndices(prev => new Set(prev)); // Trigger a re-render to update cell colors
    }, 200);

    return () => clearInterval(flickerInterval);
  }, []);

  const getCellColor = (rowIndex, colIndex) => {
    if (activeIndices.has(`${rowIndex}-${colIndex}`)) {
      const colors = [
        'bg-emerald-700',
        'bg-emerald-500',
        'bg-teal-600'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    return 'bg-stone-50';
  };

  return (
    <div className="p-8">
      <div className="grid gap-0.5" 
           style={{ 
             gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
             width: 'fit-content'
           }}>
        {Array(rows).fill().map((_, rowIndex) => (
          Array(cols).fill().map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-1.5 h-1.5 rounded-sm transition-colors duration-300 ${getCellColor(rowIndex, colIndex)}`}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default Marquee;