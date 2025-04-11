// FILE: src/components/BlogCardAnimation/BlogCardAnimation.js
import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion"; // Import from Framer Motion
import "./BlogCardAnimation.css"; // Keep your CSS for color classes
import { getTypeColor } from "../../utils/typeColors";

// Constants (Keep or adjust as needed)
const ANIMATION_AREA_WIDTH = 100;
const ANIMATION_AREA_HEIGHT = 100;
const MIN_POLYGONS = 2;
const MAX_POLYGONS = 4;
const MIN_SIZE = 20; // Slightly increased min size
const MAX_SIZE = 45; // Slightly increased max size

// Keep existing polygon shapes or define new ones
const polygonShapes = [
  "M50 0 L100 100 L0 100 Z", // Triangle
  "M0 0 H100 V100 H0 Z", // Square
  "M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z", // Hexagon
  "M50 0 L75 50 L50 100 L25 50 Z", // Diamond
  "M 0 50 A 50 50 0 1 1 100 50 A 50 50 0 1 1 0 50 Z", // Circle (path approximation)
];

// Keep your seeded random function
const seededRandom = (seed) => {
  if (seed === undefined || seed === null) seed = Math.random() * 10000;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const rand = (min, max, seed) => min + (max - min) * seededRandom(seed);

// Define different animation types
const animationVariants = [
  // 1. Gentle drift and fade
  {
    initial: (config) => ({
      x: config.initialX,
      y: config.initialY,
      scale: config.initialScale,
      rotate: config.initialRot,
      opacity: 0,
    }),
    animate: (config) => ({
      x: config.targetX,
      y: config.targetY,
      opacity: [0.1, 0.6, 0.1], // Fade in and out slightly
      scale: config.targetScale,
      rotate: config.targetRot,
      transition: {
        duration: rand(8, 15, config.uniqueSeed + 100), // Longer duration
        repeat: Infinity,
        repeatType: "mirror", // Go back and forth
        ease: "easeInOut",
        delay: config.delay,
      },
    }),
  },
  // 2. Slow pulse
  {
    initial: (config) => ({
      x: config.initialX,
      y: config.initialY,
      scale: config.initialScale * 0.9, // Start slightly smaller
      rotate: config.initialRot,
      opacity: 0.5,
    }),
    animate: (config) => ({
      scale: [
        config.initialScale * 0.9,
        config.initialScale * 1.1,
        config.initialScale * 0.9,
      ],
      opacity: [0.4, 0.7, 0.4],
      transition: {
        duration: rand(5, 10, config.uniqueSeed + 101),
        repeat: Infinity,
        ease: "easeInOut",
        delay: config.delay,
      },
    }),
  },
  // 3. Orbiting (more complex - example using x/y array)
  {
    initial: (config) => ({
      x: config.initialX,
      y: config.initialY,
      scale: config.initialScale,
      rotate: 0,
      opacity: 0.6,
    }),
    animate: (config) => ({
      // Animate along a path (e.g., circle/ellipse) - simplified here
      x: [config.initialX, config.targetX, config.initialX],
      y: [config.initialY, config.targetY, config.initialY],
      rotate: [0, 180, 360],
      transition: {
        duration: rand(10, 18, config.uniqueSeed + 102),
        repeat: Infinity,
        ease: "linear", // Constant speed
        delay: config.delay,
      },
    }),
  },
];

const BlogCardAnimation = ({ type, noteId }) => {
  const reduceMotion = useReducedMotion();
  // Use the existing type color logic - ensures theme consistency
  const typeColorClass = getTypeColor(type).replace("border-", "type-"); // e.g., "type-blue-600"

  // Seeded random generation based on noteId
  const seed = useMemo(
    () =>
      noteId
        ? noteId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 3 // Multiply seed for more variation
        : Math.random() * 1000,
    [noteId],
  );

  // Generate configuration for polygons
  const polygonConfigs = useMemo(() => {
    const count = Math.floor(rand(MIN_POLYGONS, MAX_POLYGONS + 1, seed));
    return Array.from({ length: count }, (_, i) => {
      const uniqueSeed = seed + i * 101; // Ensure unique seeds for each polygon
      const size = rand(MIN_SIZE, MAX_SIZE, uniqueSeed + 1);
      const initialX = rand(0, ANIMATION_AREA_WIDTH - size, uniqueSeed + 2);
      const initialY = rand(0, ANIMATION_AREA_HEIGHT - size, uniqueSeed + 3);
      const initialRot = rand(-30, 30, uniqueSeed + 4);
      const initialScale = rand(0.8, 1.1, uniqueSeed + 5);

      // Targets might differ based on animation variant
      const targetX = rand(0, ANIMATION_AREA_WIDTH - size, uniqueSeed + 6);
      const targetY = rand(0, ANIMATION_AREA_HEIGHT - size, uniqueSeed + 7);
      const targetRot = initialRot + rand(-60, 60, uniqueSeed + 8);
      const targetScale = rand(0.9, 1.2, uniqueSeed + 9);

      const shapeIndex = Math.floor(
        rand(0, polygonShapes.length, uniqueSeed + 10),
      );
      const animationIndex = Math.floor(
        rand(0, animationVariants.length, uniqueSeed + 11),
      );
      const delay = rand(0, 1.5, uniqueSeed + 12); // Delay in seconds

      return {
        id: `${noteId}-poly-${i}`, // Unique ID for React key
        shape: polygonShapes[shapeIndex],
        size: size, // Store size for potential use
        uniqueSeed: uniqueSeed, // Pass seed for variant transitions
        initialX,
        initialY,
        initialRot,
        initialScale,
        targetX,
        targetY,
        targetRot,
        targetScale,
        animationVariant: animationVariants[animationIndex],
        delay,
      };
    });
  }, [seed, noteId]); // Depend on seed and noteId

  // --- Static Fallback for Reduced Motion ---
  if (reduceMotion) {
    // Simple static display, using the first polygon's shape and color
    const staticConfig = polygonConfigs[0] || { shape: polygonShapes[1] }; // Default to square if no configs
    return (
      <div
        // Use CSS helper classes for background based on type color
        // Assumes you have classes like `type-blue-600-bg-light` defined in CSS
        className={`w-full h-full flex items-center justify-center ${typeColorClass}-bg-light bg-opacity-30 dark:bg-opacity-20`}
      >
        <svg
          className={`w-1/3 h-1/3 ${typeColorClass}-text opacity-50`} // Use text color utility
          viewBox="0 0 100 100" // Standard viewBox for polygons
          fill="currentColor"
        >
          <path d={staticConfig.shape} />
        </svg>
      </div>
    );
  }

  // --- Animated Version ---
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/70">
      <motion.svg
        viewBox={`0 0 ${ANIMATION_AREA_WIDTH} ${ANIMATION_AREA_HEIGHT}`}
        // Ensure SVG fills the container div
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice" // Cover the area
        aria-hidden="true" // Hide decorative SVG from screen readers
      >
        {polygonConfigs.map((config) => (
          <motion.path
            key={config.id}
            d={config.shape}
            // Apply color using the CSS utility classes
            // Example: "type-blue-600-fill fill-current opacity-40 dark:opacity-30"
            className={`${typeColorClass}-fill fill-current opacity-40 dark:opacity-30`}
            // Define animation using variants
            custom={config} // Pass config to variants
            initial="initial"
            animate="animate"
            variants={config.animationVariant}
            // Set transform origin for rotation/scaling
            style={{ transformOrigin: "50% 50%" }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export default React.memo(BlogCardAnimation); // Keep memoization
