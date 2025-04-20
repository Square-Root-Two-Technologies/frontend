import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./BlogCardAnimation.css";
import { getTypeColor } from "../../utils/typeColors"; // Ensure path is correct

// Constants (Keep As Is)
const ANIMATION_AREA_WIDTH = 100;
const ANIMATION_AREA_HEIGHT = 100;
const MIN_POLYGONS = 2;
const MAX_POLYGONS = 4;
const MIN_SIZE = 20;
const MAX_SIZE = 45;
const polygonShapes = [
  "M50 0 L100 100 L0 100 Z",
  "M0 0 H100 V100 H0 Z",
  "M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z",
  "M50 0 L75 50 L50 100 L25 50 Z",
  "M 0 50 A 50 50 0 1 1 100 50 A 50 50 0 1 1 0 50 Z",
];

// Seeded Random Functions (Keep As Is)
const seededRandom = (seed) => {
  if (seed === undefined || seed === null) seed = Math.random() * 10000;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
const rand = (min, max, seed) => min + (max - min) * seededRandom(seed);

// Animation Variants (Keep As Is)
const animationVariants = [
  {
    /* ... variant 1 ... */
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
      opacity: [0.1, 0.6, 0.1],
      scale: config.targetScale,
      rotate: config.targetRot,
      transition: {
        duration: rand(8, 15, config.uniqueSeed + 100),
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay: config.delay,
      },
    }),
  },
  {
    /* ... variant 2 ... */
    initial: (config) => ({
      x: config.initialX,
      y: config.initialY,
      scale: config.initialScale * 0.9,
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
  {
    /* ... variant 3 ... */
    initial: (config) => ({
      x: config.initialX,
      y: config.initialY,
      scale: config.initialScale,
      rotate: 0,
      opacity: 0.6,
    }),
    animate: (config) => ({
      x: [config.initialX, config.targetX, config.initialX],
      y: [config.initialY, config.targetY, config.initialY],
      rotate: [0, 180, 360],
      transition: {
        duration: rand(10, 18, config.uniqueSeed + 102),
        repeat: Infinity,
        ease: "linear",
        delay: config.delay,
      },
    }),
  },
];

// --- BlogCardAnimation Component ---
const BlogCardAnimation = ({ type, noteId }) => {
  // 'type' prop now holds the category name
  const reduceMotion = useReducedMotion();

  // Get the base color class prefix using the category name ('type' prop)
  const typeColorClass = getTypeColor(type).replace("border-", "type-");
  // Example: if type="javascript", getTypeColor returns "border-amber-500"
  // typeColorClass becomes "type-amber-500"
  // The CSS file (`BlogCardAnimation.css`) needs classes like `.type-amber-500-fill`, etc.

  // Seed generation based on noteId (Keep As Is)
  const seed = useMemo(
    () =>
      noteId
        ? noteId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 3
        : Math.random() * 1000,
    [noteId],
  );

  // Polygon configuration generation (Keep As Is)
  const polygonConfigs = useMemo(() => {
    const count = Math.floor(rand(MIN_POLYGONS, MAX_POLYGONS + 1, seed));
    return Array.from({ length: count }, (_, i) => {
      const uniqueSeed = seed + i * 101;
      const size = rand(MIN_SIZE, MAX_SIZE, uniqueSeed + 1);
      const initialX = rand(0, ANIMATION_AREA_WIDTH - size, uniqueSeed + 2);
      const initialY = rand(0, ANIMATION_AREA_HEIGHT - size, uniqueSeed + 3);
      const initialRot = rand(-30, 30, uniqueSeed + 4);
      const initialScale = rand(0.8, 1.1, uniqueSeed + 5);
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
      const delay = rand(0, 1.5, uniqueSeed + 12);
      return {
        id: `${noteId}-poly-${i}`,
        shape: polygonShapes[shapeIndex],
        size: size,
        uniqueSeed: uniqueSeed,
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
  }, [seed, noteId]);

  // Reduced motion rendering (Keep As Is, but uses updated typeColorClass)
  if (reduceMotion) {
    const staticConfig = polygonConfigs[0] || { shape: polygonShapes[1] };
    return (
      <div
        // Use the category-derived color class for background
        className={`w-full h-full flex items-center justify-center ${typeColorClass}-bg-light bg-opacity-30 dark:bg-opacity-20`}
      >
        <svg
          // Use the category-derived color class for text/fill
          className={`w-1/3 h-1/3 ${typeColorClass}-text opacity-50`}
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d={staticConfig.shape} />
        </svg>
      </div>
    );
  }

  // Full animation rendering (Keep As Is, but uses updated typeColorClass)
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/70">
      <motion.svg
        viewBox={`0 0 ${ANIMATION_AREA_WIDTH} ${ANIMATION_AREA_HEIGHT}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {polygonConfigs.map((config) => (
          <motion.path
            key={config.id}
            d={config.shape}
            // Use the category-derived color class for fill
            className={`${typeColorClass}-fill fill-current opacity-40 dark:opacity-30`}
            custom={config}
            initial="initial"
            animate="animate"
            variants={config.animationVariant}
            style={{ transformOrigin: "50% 50%" }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export default React.memo(BlogCardAnimation);
