import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { shapes } from './shapes';
import { coordinates } from './shapes';
import { convertSvgPathToCoordinates } from './pathProcessor';

// const marqueeCoordinates = coordinates.letters;

const Marquee = ({ rows = 80, cols = 80 }) => {
  const [activeIndices, setActiveIndices] = useState(new Set());

  const marqueeCoordinates = convertSvgPathToCoordinates(shapes.heart, rows, cols);

  const colors = useMemo(() => [
    'bg-emerald-700',
    'bg-emerald-500',
    'bg-teal-600'
  ], []);

  useEffect(() => {
    let currentIndex = 0;

    const animationInterval = setInterval(() => {
      if (currentIndex < marqueeCoordinates.length) {
        const [row, col] = marqueeCoordinates[currentIndex];
        setActiveIndices(prev => {
          const newSet = new Set(prev);
          newSet.add(`${row}-${col}`);
          return newSet;
        });
        currentIndex++;
      } else {
        clearInterval(animationInterval);
      }
    }, 40);

    return () => clearInterval(animationInterval);
  }, []);

  // Flickering effect
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      setActiveIndices(prev => new Set(prev)); // Trigger a re-render to update cell colors
    }, 200);

    return () => clearInterval(flickerInterval);
  }, []);

  const getCellColor = useCallback((rowIndex, colIndex) => {
    if (!activeIndices.has(`${rowIndex}-${colIndex}`)) return 'bg-stone-100';

      return colors[Math.floor(Math.random() * colors.length)];
  }, [activeIndices]);

  return (
    <div className="p-8 bg-stone-50 min-h-screen w-screen flex items-center justify-center">
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