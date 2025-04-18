import React, { useState } from "react";
// Removed framer-motion import
import {
  FaPlay,
  FaPause,
  FaCog,
  FaPlus,
  FaMinus,
  FaTachometerAlt,
} from "react-icons/fa";

const AnimationController = ({
  isAnimating,
  speed,
  particleCount,
  onIsAnimatingChange,
  onSpeedChange,
  onParticleCountChange,
  minParticles = 2,
  maxParticles = 20,
  minSpeed = 0.001,
  maxSpeed = 0.05,
  speedStep = 0.001,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleIncreaseParticles = () => {
    if (particleCount < maxParticles) {
      onParticleCountChange(particleCount + 1);
    }
  };

  const handleDecreaseParticles = () => {
    if (particleCount > minParticles) {
      onParticleCountChange(particleCount - 1);
    }
  };

  const handleSpeedSliderChange = (e) => {
    onSpeedChange(parseFloat(e.target.value));
  };

  // Base classes for the container
  const baseContainerClasses =
    "absolute bottom-5 right-5 bg-gray-700/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg z-20 transition-all duration-100 ease-linear"; // Added basic transition for smoothness if browser interpolates non-animated props

  // Classes for collapsed state
  const collapsedClasses = "w-11 h-11 rounded-full";

  // Classes for expanded state
  const expandedClasses = "w-[220px] h-auto rounded-lg p-3 pt-[50px]"; // Apply padding only when expanded

  return (
    <div
      className={`${baseContainerClasses} ${
        isHovered ? expandedClasses : collapsedClasses
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Always visible Icon Area - Positioned Top-Left */}
      <div className="absolute top-0 left-0 w-11 h-11 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onIsAnimatingChange();
          }}
          className="flex items-center justify-center w-full h-full text-white hover:bg-gray-600/60 dark:hover:bg-gray-700/60 transition-colors rounded-full"
          aria-label={isAnimating ? "Pause Animation" : "Play Animation"}
        >
          {/* Show Cog when collapsed, Play/Pause when expanded */}
          {isHovered ? (
            isAnimating ? (
              <FaPause size={16} />
            ) : (
              <FaPlay size={16} className="ml-0.5" />
            )
          ) : (
            <FaCog size={18} />
          )}
        </button>
      </div>

      {/* Expanded Controls Container - Conditionally Rendered */}
      {isHovered && (
        <div className="space-y-3">
          {" "}
          {/* No motion needed */}
          {/* Speed Control */}
          <div className="text-white text-sm">
            <label
              htmlFor="speedControl"
              className="flex items-center mb-1 font-medium"
            >
              <FaTachometerAlt className="mr-2" /> Speed: {speed.toFixed(3)}
            </label>
            <input
              type="range"
              id="speedControl"
              min={minSpeed}
              max={maxSpeed}
              step={speedStep}
              value={speed}
              onChange={handleSpeedSliderChange}
              className="w-full h-2 bg-gray-500 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          {/* Particle Count Control */}
          <div className="text-white text-sm">
            <label className="flex items-center mb-1 font-medium">
              Particles: {particleCount}
            </label>
            <div className="flex items-center justify-between space-x-2">
              <button
                onClick={handleDecreaseParticles}
                disabled={particleCount <= minParticles}
                className="p-1.5 bg-gray-600 hover:bg-gray-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                aria-label="Decrease particle count"
              >
                <FaMinus size={12} />
              </button>
              <span className="flex-grow text-center font-mono text-xs tabular-nums">
                {particleCount} / {maxParticles}
              </span>
              <button
                onClick={handleIncreaseParticles}
                disabled={particleCount >= maxParticles}
                className="p-1.5 bg-gray-600 hover:bg-gray-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                aria-label="Increase particle count"
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimationController;
