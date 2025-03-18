import React, { useRef, useState, useEffect } from "react"; // Import React hooks for state and side effects
import { Canvas, useFrame } from "@react-three/fiber"; // Import Three.js canvas and animation loop
import { Text, Line, OrbitControls } from "@react-three/drei"; // Import Three.js helpers for text, lines, and controls
import * as THREE from "three"; // Import Three.js core library

// Gravitational constant for force calculations
const G = 0.1;
// Size of the simulation box (half-extent, so total size is 20x20x20)
const BOX_SIZE = 10;
// Radius of each particle sphere
const PARTICLE_RADIUS = 0.3;
// Minimum distance between particles for gravity lines to appear
const MIN_DISTANCE_FOR_LINES = 0.5;

// Function to generate an array of particle objects with random properties
const generateParticles = (count) => {
  return new Array(count).fill().map((_, i) => {
    // Random color for each particle
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    return {
      id: i, // Unique identifier for the particle
      name: `P${i + 1}`, // Name like "P1", "P2", etc.
      mass: Math.random() * 10 + 5, // Random mass between 5 and 15
      position: new THREE.Vector3( // Initial random position within box
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ),
      velocity: new THREE.Vector3( // Initial random velocity (small)
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
      ),
      color, // Assign the random color
    };
  });
};

// Component to simulate particle movement and interactions
const ParticleSimulation = ({
  speed = 0.01, // Speed multiplier for particle velocity, default very slow
  isAnimating = true, // Flag to toggle animation on/off
  particleCount, // Number of particles to simulate
}) => {
  // Ref to store the array of particles, persists across renders
  const particles = useRef(generateParticles(particleCount));
  // Ref to store mesh objects for updating positions
  const meshRefs = useRef([]);
  // State to store gravity lines for rendering
  const [lines, setLines] = useState([]);

  // Effect to regenerate particles when particleCount changes
  useEffect(() => {
    particles.current = generateParticles(particleCount); // Update particles array
    meshRefs.current = []; // Clear mesh references
  }, [particleCount]);

  // Animation loop runs every frame
  useFrame(() => {
    if (!isAnimating) return; // Exit if animation is paused

    const newLines = []; // Array to store new gravity lines for this frame

    // Calculate gravitational forces and lines between all particle pairs
    for (let i = 0; i < particles.current.length; i++) {
      for (let j = i + 1; j < particles.current.length; j++) {
        const p1 = particles.current[i]; // First particle
        const p2 = particles.current[j]; // Second particle
        const distance = p1.position.distanceTo(p2.position); // Distance between particles
        const forceMag = (G * p1.mass * p2.mass) / (distance * distance + 0.1); // Gravitational force magnitude

        const direction = p2.position.clone().sub(p1.position).normalize(); // Unit vector from p1 to p2
        const force = direction.multiplyScalar(forceMag); // Force vector

        p1.velocity.add(force.clone().divideScalar(p1.mass)); // Update p1 velocity (F = ma -> a = F/m)
        p2.velocity.sub(force.clone().divideScalar(p2.mass)); // Update p2 velocity (opposite direction)

        // Only render gravity lines if particles are far enough apart
        if (distance > MIN_DISTANCE_FOR_LINES) {
          const start = p1.position
            .clone()
            .add(direction.multiplyScalar(PARTICLE_RADIUS)); // Start point of line (edge of p1)
          const end = p2.position
            .clone()
            .sub(direction.multiplyScalar(PARTICLE_RADIUS)); // End point of line (edge of p2)
          newLines.push({ start, end, strength: forceMag }); // Add line object to array
        }
      }
    }

    // Update particle positions and apply boundary conditions
    particles.current.forEach((p, index) => {
      const velocityWithSpeed = p.velocity.clone().multiplyScalar(speed); // Scale velocity by speed factor
      p.position.add(velocityWithSpeed); // Update position based on scaled velocity

      // Bounce particles off box boundaries with damping
      if (p.position.x > BOX_SIZE) {
        p.position.x = BOX_SIZE; // Clamp to edge
        p.velocity.x *= -0.9; // Reverse and dampen velocity
      } else if (p.position.x < -BOX_SIZE) {
        p.position.x = -BOX_SIZE;
        p.velocity.x *= -0.9;
      }

      if (p.position.y > BOX_SIZE) {
        p.position.y = BOX_SIZE;
        p.velocity.y *= -0.9;
      } else if (p.position.y < -BOX_SIZE) {
        p.position.y = -BOX_SIZE;
        p.velocity.y *= -0.9;
      }

      if (p.position.z > BOX_SIZE) {
        p.position.z = BOX_SIZE;
        p.velocity.z *= -0.9;
      } else if (p.position.z < -BOX_SIZE) {
        p.position.z = -BOX_SIZE;
        p.velocity.z *= -0.9;
      }

      // Sync mesh position with particle position
      if (meshRefs.current[index]) {
        meshRefs.current[index].position.set(
          p.position.x,
          p.position.y,
          p.position.z,
        );
      }
    });

    setLines(newLines); // Update state with new gravity lines
  });

  return (
    <>
      {/* Wireframe box to visualize simulation boundaries */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[BOX_SIZE * 2, BOX_SIZE * 2, BOX_SIZE * 2]} />{" "}
        {/* Define box size */}
        <meshBasicMaterial
          color="#5c5c5c"
          wireframe
          wireframeLinewidth={2}
        />{" "}
        {/* Gray wireframe */}
      </mesh>

      {/* Render each particle as a sphere with a label */}
      {particles.current.map((p, index) => (
        <mesh key={p.id} ref={(el) => (meshRefs.current[index] = el)}>
          <sphereGeometry args={[PARTICLE_RADIUS, 16, 16]} />{" "}
          {/* Spherical geometry */}
          <meshStandardMaterial color={p.color} /> {/* Random color material */}
          <Text
            position={[
              p.position.x - PARTICLE_RADIUS - 0.1,
              p.position.y + PARTICLE_RADIUS + 0.1,
              p.position.z,
            ]}
            fontSize={0.25} // Size of text
            color="#f4e3d3" // Soft cream color
            anchorX="right" // Align text to right of particle
            anchorY="bottom" // Align text above particle
            outlineWidth={0.02} // Outline thickness
            outlineColor="#2b2b2b" // Dark gray outline
          >
            {`${p.name} | m: ${p.mass.toFixed(1)}`}{" "}
            {/* Display name and mass */}
          </Text>
        </mesh>
      ))}

      {/* Render gravity lines and force labels */}
      {lines.map((line, idx) => {
        const midPoint = line.start.clone().lerp(line.end, 0.5); // Midpoint of the line
        const direction = line.end.clone().sub(line.start).normalize(); // Direction vector of line
        const perpendicular = new THREE.Vector3(0, 0, 1)
          .cross(direction)
          .normalize(); // Perpendicular vector for label offset
        const labelPosition = midPoint.add(perpendicular.multiplyScalar(0.3)); // Offset label position

        return (
          <React.Fragment key={idx}>
            <Line
              points={[line.start.toArray(), line.end.toArray()]} // Line endpoints
              color="#a68a64" // Muted tan color
              lineWidth={Math.max(1, line.strength * 0.5)} // Width based on force strength
              opacity={0.8} // Slight transparency
              transparent // Enable transparency
            />
            <Text
              position={labelPosition} // Position near midpoint
              fontSize={0.25} // Text size
              color="#d9b8a2" // Muted peach color
              anchorX="center" // Center text horizontally
              anchorY="middle" // Center text vertically
              outlineWidth={0.02} // Outline thickness
              outlineColor="#2b2b2b" // Dark gray outline
            >
              {`F: ${line.strength.toExponential(1)}`}{" "}
              {/* Display force in exponential notation */}
            </Text>
          </React.Fragment>
        );
      })}
    </>
  );
};

// Main component for the space scene with controls
const SpaceScene = () => {
  // State for particle speed, starts very slow
  const [particleSpeed, setParticleSpeed] = useState(0.01);
  // State to toggle animation
  const [isAnimating, setIsAnimating] = useState(true);
  // State for number of particles
  const [particleCount, setParticleCount] = useState(10);

  // Function to toggle animation state
  const toggleAnimation = () => setIsAnimating((prev) => !prev);
  // Function to increase particle count
  const increaseParticles = () => setParticleCount((prev) => prev + 1);
  // Function to decrease particle count, ensuring at least 1
  const decreaseParticles = () =>
    setParticleCount((prev) => Math.max(1, prev - 1));

  return (
    // Container for canvas and controls
    <div className="space-scene-container">
      {/* Three.js canvas for 3D rendering */}
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#1a1a1a"]} />{" "}
        {/* Set background color */}
        <ambientLight intensity={0.5} /> {/* Ambient lighting */}
        <pointLight position={[10, 10, 10]} intensity={1} />{" "}
        {/* Directional light */}
        <ParticleSimulation
          speed={particleSpeed} // Pass speed to simulation
          isAnimating={isAnimating} // Pass animation toggle
          particleCount={particleCount} // Pass particle count
        />
        <OrbitControls /> {/* Enable mouse interaction for rotation/zoom */}
      </Canvas>
      {/* Control panel for user interaction */}
      <div className="controls">
        <label>Particle Speed: {particleSpeed.toFixed(4)}x</label>{" "}
        {/* Display speed with 4 decimals */}
        <input
          type="range" // Slider input
          min="0.0001" // Minimum speed
          max="10" // Maximum speed
          step="0.0001" // Step size for fine control
          value={particleSpeed} // Current speed value
          onChange={(e) => setParticleSpeed(parseFloat(e.target.value))} // Update speed on change
        />
        <div className="particle-controls">
          <label>Particles: {particleCount}</label>{" "}
          {/* Display particle count */}
          <div className="particle-buttons">
            <button onClick={decreaseParticles}>−</button>{" "}
            {/* Decrease particle count */}
            <button onClick={increaseParticles}>+</button>{" "}
            {/* Increase particle count */}
          </div>
        </div>
        <button className="toggle-button" onClick={toggleAnimation}>
          {isAnimating ? "Pause" : "Play"} {/* Toggle animation text */}
        </button>
      </div>
    </div>
  );
};

export default SpaceScene; // Export component for use in HomeScreenFebAstronomy
