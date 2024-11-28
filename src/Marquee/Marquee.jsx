import React, { useState, useEffect } from 'react';

const Marquee = () => {
  const [activeIndices, setActiveIndices] = useState(new Set());
  const rows = 40;
  const cols = 80;

  const letterCoordinates = [
    // f - upside down J with crossbar
    [22,15], [21,15], [20,15], [19,15], [18,15], [17,15], [16,15], [15,15],
    [15,16], [15,17], [15,18],
    [18,14], [18,15], [18,16],
    
    // l
    [15,22], [16,22], [17,22], [18,22], [19,22], [20,22], [21,22], [22,22], [22,23],
    
    // o (aligned with baseline)
    [16,27], [15,28], [15,29], [15,30], [16,31], [17,31], [18,31], [19,30], [19,29], [19,28], [18,27], [17,27], [16,27],
    
    // g (aligned with baseline)
    [16,35], [15,36], [15,37], [15,38], [16,39], [17,39], [18,39], [19,38], [19,37], [19,36], [18,35], [17,35], [16,35],
    [19,39], [20,39], [21,38], [21,37],
    
    // u (aligned with baseline)
    [15,43], [16,43], [17,43], [18,43], [19,43], [20,44], [20,45], [19,46], [18,46], [17,46], [16,46], [15,46],
    
    // o (aligned with baseline)
    [16,50], [15,51], [15,52], [15,53], [16,54], [17,54], [18,54], [19,53], [19,52], [19,51], [18,50], [17,50], [16,50]
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