import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./SpaceScene.css"; // Import the CSS file

// Gravitational constant for force calculations
const G = 0.1;
const BOX_SIZE = 10;
const PARTICLE_RADIUS = 0.3;
const MIN_DISTANCE_FOR_LINES = 0.5;

// Function to generate particles
const generateParticles = (count) => {
  return new Array(count).fill().map((_, i) => {
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    return {
      id: i,
      name: `P${i + 1}`,
      mass: Math.random() * 10 + 5,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
      ),
      color,
    };
  });
};

// ParticleSimulation component
const ParticleSimulation = ({
  speed = 0.01,
  isAnimating = true,
  particleCount,
}) => {
  const particles = useRef(generateParticles(particleCount));
  const meshRefs = useRef([]);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    particles.current = generateParticles(particleCount);
    meshRefs.current = [];
  }, [particleCount]);

  useFrame(() => {
    if (!isAnimating) return;

    const newLines = [];
    for (let i = 0; i < particles.current.length; i++) {
      for (let j = i + 1; j < particles.current.length; j++) {
        const p1 = particles.current[i];
        const p2 = particles.current[j];
        const distance = p1.position.distanceTo(p2.position);
        const forceMag = (G * p1.mass * p2.mass) / (distance * distance + 0.1);
        const direction = p2.position.clone().sub(p1.position).normalize();
        const force = direction.multiplyScalar(forceMag);

        p1.velocity.add(force.clone().divideScalar(p1.mass));
        p2.velocity.sub(force.clone().divideScalar(p2.mass));

        if (distance > MIN_DISTANCE_FOR_LINES) {
          const start = p1.position
            .clone()
            .add(direction.multiplyScalar(PARTICLE_RADIUS));
          const end = p2.position
            .clone()
            .sub(direction.multiplyScalar(PARTICLE_RADIUS));
          newLines.push({ start, end, strength: forceMag });
        }
      }
    }

    particles.current.forEach((p, index) => {
      const velocityWithSpeed = p.velocity.clone().multiplyScalar(speed);
      p.position.add(velocityWithSpeed);

      if (p.position.x > BOX_SIZE) {
        p.position.x = BOX_SIZE;
        p.velocity.x *= -0.9;
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

      if (meshRefs.current[index]) {
        meshRefs.current[index].position.set(
          p.position.x,
          p.position.y,
          p.position.z,
        );
      }
    });

    setLines(newLines);
  });

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[BOX_SIZE * 2, BOX_SIZE * 2, BOX_SIZE * 2]} />
        <meshBasicMaterial color="#5c5c5c" wireframe wireframeLinewidth={2} />
      </mesh>
      {particles.current.map((p, index) => (
        <mesh key={p.id} ref={(el) => (meshRefs.current[index] = el)}>
          <sphereGeometry args={[PARTICLE_RADIUS, 16, 16]} />
          <meshStandardMaterial color={p.color} />
          <Text
            position={[
              p.position.x - PARTICLE_RADIUS - 0.1,
              p.position.y + PARTICLE_RADIUS + 0.1,
              p.position.z,
            ]}
            fontSize={0.25}
            color="#f4e3d3"
            anchorX="right"
            anchorY="bottom"
            outlineWidth={0.02}
            outlineColor="#2b2b2b"
          >
            {`${p.name} | m: ${p.mass.toFixed(1)}`}
          </Text>
        </mesh>
      ))}
      {lines.map((line, idx) => {
        const midPoint = line.start.clone().lerp(line.end, 0.5);
        const direction = line.end.clone().sub(line.start).normalize();
        const perpendicular = new THREE.Vector3(0, 0, 1)
          .cross(direction)
          .normalize();
        const labelPosition = midPoint.add(perpendicular.multiplyScalar(0.3));
        return (
          <React.Fragment key={idx}>
            <Line
              points={[line.start.toArray(), line.end.toArray()]}
              color="#a68a64"
              lineWidth={Math.max(1, line.strength * 0.5)}
              opacity={0.8}
              transparent
            />
            <Text
              position={labelPosition}
              fontSize={0.25}
              color="#d9b8a2"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#2b2b2b"
            >
              {`F: ${line.strength.toExponential(1)}`}
            </Text>
          </React.Fragment>
        );
      })}
    </>
  );
};

// Main SpaceScene component
const SpaceScene = () => {
  const [particleSpeed, setParticleSpeed] = useState(0.01);
  const [isAnimating, setIsAnimating] = useState(true);
  const [particleCount, setParticleCount] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const controlsRef = useRef(null); // Ref for the controls div

  const toggleAnimation = () => setIsAnimating((prev) => !prev);
  const increaseParticles = () => setParticleCount((prev) => prev + 1);
  const decreaseParticles = () =>
    setParticleCount((prev) => Math.max(1, prev - 1));
  const toggleControls = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to document
    setIsExpanded((prev) => !prev);
  };

  // Handle outside click to collapse on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isExpanded &&
        controlsRef.current &&
        !controlsRef.current.contains(e.target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isExpanded]); // Re-run when isExpanded changes

  return (
    <div className="space-scene-container">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#1a1a1a"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ParticleSimulation
          speed={particleSpeed}
          isAnimating={isAnimating}
          particleCount={particleCount}
        />
        <OrbitControls />
      </Canvas>
      <div
        className={`controls ${isExpanded ? "expanded" : ""}`}
        ref={controlsRef}
      >
        <button className="controls-button" onClick={toggleControls}>
          Controls
        </button>
        <div className="controls-content">
          <label>Particle Speed: {particleSpeed.toFixed(4)}x</label>
          <input
            type="range"
            min="0.0001"
            max="10"
            step="0.0001"
            value={particleSpeed}
            onChange={(e) => setParticleSpeed(parseFloat(e.target.value))}
          />
          <div className="particle-controls">
            <label>Particles: {particleCount}</label>
            <div className="particle-buttons">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  decreaseParticles();
                }}
              >
                −
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  increaseParticles();
                }}
              >
                +
              </button>
            </div>
          </div>
          <button
            className="toggle-button"
            onClick={(e) => {
              e.stopPropagation();
              toggleAnimation();
            }}
          >
            {isAnimating ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpaceScene;
