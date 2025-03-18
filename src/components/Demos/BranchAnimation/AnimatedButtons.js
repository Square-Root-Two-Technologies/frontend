import React, { useState } from "react";
import "./AnimatedButtons.css";

const AnimatedButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [positions, setPositions] = useState({
    root: { x: 0, y: 0 },
    explore: { x: 0, y: 0 },
    learn: { x: 0, y: 0 },
    connect: { x: 0, y: 0 },
  });

  const getRandomPosition = (existingPositions = [], isRoot = false) => {
    const vw = window.innerWidth;
    const minDistance = vw < 768 ? 40 : 80; // Minimum distance from center
    const maxDistance = vw < 768 ? 100 : 150; // Maximum distance from center
    const buttonWidth = vw < 768 ? 60 : 80; // Approx width for collision (based on padding + text)
    const buttonHeight = vw < 768 ? 30 : 40; // Approx height for collision
    const minSpacing = vw < 768 ? 20 : 30; // Minimum spacing between buttons

    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop

    while (attempts < maxAttempts) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = isRoot
        ? Math.random() * maxDistance
        : minDistance + Math.random() * (maxDistance - minDistance);
      const newPos = {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      };

      // Check collision with existing positions
      const collides = existingPositions.some((pos) => {
        const dx = Math.abs(newPos.x - pos.x);
        const dy = Math.abs(newPos.y - pos.y);
        return dx < buttonWidth + minSpacing && dy < buttonHeight + minSpacing;
      });

      if (!collides) return newPos;
      attempts++;
    }

    // Fallback: return a position even if it might overlap (rare case)
    return {
      x: Math.cos(Math.random() * 2 * Math.PI) * maxDistance,
      y: Math.sin(Math.random() * 2 * Math.PI) * maxDistance,
    };
  };

  const handleToggle = () => {
    if (!isExpanded) {
      const newPositions = [];
      const newRootPos = getRandomPosition(newPositions, true);
      newPositions.push(newRootPos);

      const explorePos = getRandomPosition(newPositions);
      newPositions.push(explorePos);

      const learnPos = getRandomPosition(newPositions);
      newPositions.push(learnPos);

      const connectPos = getRandomPosition(newPositions);
      newPositions.push(connectPos);

      setPositions({
        root: newRootPos,
        explore: explorePos,
        learn: learnPos,
        connect: connectPos,
      });
    } else {
      setPositions({
        root: { x: 0, y: 0 },
        explore: { x: 0, y: 0 },
        learn: { x: 0, y: 0 },
        connect: { x: 0, y: 0 },
      });
    }
    setIsExpanded(!isExpanded);
  };

  const containerWidth =
    window.innerWidth < 768 ? Math.min(window.innerWidth, 400) : 400;
  const containerHeight =
    window.innerWidth < 768 ? Math.min(300, window.innerHeight) : 400;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  return (
    <div className="button-container">
      <svg className="connectors">
        {isExpanded && (
          <>
            <line
              x1={centerX + positions.root.x}
              y1={centerY + positions.root.y}
              x2={centerX + positions.explore.x}
              y2={centerY + positions.explore.y}
              stroke="gray"
              strokeWidth="2"
            />
            <line
              x1={centerX + positions.root.x}
              y1={centerY + positions.root.y}
              x2={centerX + positions.learn.x}
              y2={centerY + positions.learn.y}
              stroke="gray"
              strokeWidth="2"
            />
            <line
              x1={centerX + positions.root.x}
              y1={centerY + positions.root.y}
              x2={centerX + positions.connect.x}
              y2={centerY + positions.connect.y}
              stroke="gray"
              strokeWidth="2"
            />
          </>
        )}
      </svg>

      <button
        className="root-button"
        onClick={handleToggle}
        style={{
          transform: `translate(${positions.root.x}px, ${positions.root.y}px)`,
        }}
      >
        Get Started
      </button>

      <button
        className={`child-button explore ${isExpanded ? "expanded" : ""}`}
        style={{
          transform: `translate(${positions.explore.x}px, ${positions.explore.y}px)`,
        }}
      >
        Explore
      </button>

      <button
        className={`child-button learn ${isExpanded ? "expanded" : ""}`}
        style={{
          transform: `translate(${positions.learn.x}px, ${positions.learn.y}px)`,
        }}
      >
        Learn
      </button>

      <button
        className={`child-button connect ${isExpanded ? "expanded" : ""}`}
        style={{
          transform: `translate(${positions.connect.x}px, ${positions.connect.y}px)`,
        }}
      >
        Connect
      </button>
    </div>
  );
};

export default AnimatedButtons;
