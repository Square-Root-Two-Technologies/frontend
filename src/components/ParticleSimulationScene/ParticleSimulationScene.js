import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber"; // Import useThree
import { Text, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ThemeContext } from "../../context/ThemeProvider/ThemeProvider";
import AnimationController from "../AnimationController/AnimationController";

// Constants for the simulation (G, BOX_SIZE, etc.) remain the same
const G = 0.6;
const BOX_SIZE = 10;
const PARTICLE_RADIUS = 0.3;
const MIN_DISTANCE_FOR_LINES = 0.5;

// Static colors for elements within the scene remain the same
const themeColors = {
  boxWireframe: "#A8A29E",
  particleText: "#E5E7EB",
  particleTextOutline: "#000000",
  line: "#A8A29E",
};

// generateParticles function remains the same
const generateParticles = (count) => {
  return new Array(count).fill().map((_, i) => {
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    return {
      id: i,
      name: `P${i + 1}`,
      mass: Math.random() * 10 + 5,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * (BOX_SIZE * 1.5),
        (Math.random() - 0.5) * (BOX_SIZE * 1.5),
        (Math.random() - 0.5) * (BOX_SIZE * 1.5),
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
      ),
      color,
    };
  });
};

// SimulationCore component remains the same
const SimulationCore = ({
  speed = 0.01,
  isAnimating = true,
  particleCount = 5,
}) => {
  const particles = useRef(generateParticles(particleCount));
  const meshRefs = useRef([]);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    console.log(
      `SimulationCore Effect: Particle count changed to ${particleCount}. Re-generating.`,
    );
    particles.current = generateParticles(particleCount);
    meshRefs.current = new Array(particleCount);
    setLines([]);
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!isAnimating) return;

    const dt = delta * 60;
    const effectiveSpeed = speed * dt;
    const newLines = [];

    // Gravity Calculation
    for (let i = 0; i < particles.current.length; i++) {
      for (let j = i + 1; j < particles.current.length; j++) {
        if (!particles.current[i] || !particles.current[j]) continue;

        const p1 = particles.current[i];
        const p2 = particles.current[j];
        const difference = p2.position.clone().sub(p1.position);
        const distanceSq = difference.lengthSq();
        const distance = Math.sqrt(distanceSq);

        if (distance < PARTICLE_RADIUS * 2) continue;

        const forceMag = (G * p1.mass * p2.mass) / (distanceSq + 0.1);
        const direction = difference.normalize();
        const force = direction
          .clone()
          .multiplyScalar(forceMag * effectiveSpeed);

        p1.velocity.add(force.clone().divideScalar(p1.mass));
        p2.velocity.sub(force.clone().divideScalar(p2.mass));

        if (distance > MIN_DISTANCE_FOR_LINES) {
          const start = p1.position
            .clone()
            .add(direction.clone().multiplyScalar(PARTICLE_RADIUS));
          const end = p2.position
            .clone()
            .sub(direction.clone().multiplyScalar(PARTICLE_RADIUS));
          newLines.push({ start, end, strength: forceMag });
        }
      }
    }

    // Update Particle Positions & Boundary Check
    particles.current.forEach((p, index) => {
      if (!p) return;

      p.position.add(p.velocity.clone().multiplyScalar(effectiveSpeed));

      if (Math.abs(p.position.x) > BOX_SIZE) {
        p.position.x = Math.sign(p.position.x) * BOX_SIZE;
        p.velocity.x *= -0.7;
      }
      if (Math.abs(p.position.y) > BOX_SIZE) {
        p.position.y = Math.sign(p.position.y) * BOX_SIZE;
        p.velocity.y *= -0.7;
      }
      if (Math.abs(p.position.z) > BOX_SIZE) {
        p.position.z = Math.sign(p.position.z) * BOX_SIZE;
        p.velocity.z *= -0.7;
      }

      if (meshRefs.current[index]) {
        meshRefs.current[index].position.copy(p.position);
      }
    });

    setLines(newLines);
  });

  return (
    <>
      {/* Bounding Box Wireframe */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[BOX_SIZE * 2, BOX_SIZE * 2, BOX_SIZE * 2]} />
        <meshBasicMaterial
          color={themeColors.boxWireframe}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Render Particles */}
      {particles.current.map((p, index) => {
        if (!p) return null;
        return (
          <mesh
            key={p.id}
            ref={(el) => (meshRefs.current[index] = el)}
            position={p.position}
          >
            <sphereGeometry args={[PARTICLE_RADIUS, 16, 16]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.5}
              metalness={0.1}
            />
            <Text
              position={[PARTICLE_RADIUS + 0.1, PARTICLE_RADIUS + 0.1, 0]}
              fontSize={0.2}
              color={themeColors.particleText}
              anchorX="left"
              anchorY="bottom"
              outlineWidth={0.01}
              outlineColor={themeColors.particleTextOutline}
            >
              {p.name}
            </Text>
          </mesh>
        );
      })}

      {/* Render Interaction Lines */}
      {lines.map((line, idx) => (
        <React.Fragment key={`line-${idx}`}>
          <Line
            points={[line.start, line.end]}
            color={themeColors.line}
            lineWidth={Math.max(0.5, line.strength * 0.1)}
            opacity={0.6}
            transparent
          />
        </React.Fragment>
      ))}
    </>
  );
};

// ----- NEW HELPER COMPONENT -----
// This component runs *inside* the Canvas context and can use R3F hooks
function SceneSetup({ backgroundColor }) {
  const { gl } = useThree(); // Get the WebGL renderer instance

  // Effect to update the background color whenever it changes
  useEffect(() => {
    // console.log("SceneSetup Effect: Setting clear color to", backgroundColor);
    gl.setClearColor(backgroundColor);
  }, [backgroundColor, gl]); // Depend on color and gl instance

  return null; // This component doesn't render anything itself
}
// ----- END HELPER COMPONENT -----

/**
 * Main component that sets up the Canvas and renders the simulation controller.
 */
const ParticleSimulationScene = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [speed, setSpeed] = useState(0.01);
  const [particleCount, setParticleCount] = useState(5);
  const MAX_PARTICLES_LIMIT = 20;

  const { theme } = useContext(ThemeContext);

  const sceneBackgroundColor = useMemo(() => {
    console.log(`Theme changed to: ${theme}. Updating background color.`); // Log theme changes
    return theme === "dark" ? "#000000" : "#FEFBF6";
  }, [theme]);

  const handleIsAnimatingChange = useCallback(() => {
    setIsAnimating((prev) => !prev);
  }, []);

  const handleSpeedChange = useCallback((newSpeed) => {
    setSpeed(newSpeed);
  }, []);

  const handleParticleCountChange = useCallback(
    (newCount) => {
      setParticleCount(Math.min(newCount, MAX_PARTICLES_LIMIT));
    },
    [MAX_PARTICLES_LIMIT],
  );

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
        frameloop="demand"
        // REMOVED onCreated - SceneSetup useEffect handles initial and updates
        gl={{ antialias: true, alpha: false }}
      >
        {/* Render the helper component first */}
        <SceneSetup backgroundColor={sceneBackgroundColor} />

        {/* Lighting */}
        <ambientLight intensity={0.6} color="#ffffff" />
        <pointLight position={[15, 15, 15]} intensity={0.8} color="#ffffff" />
        <pointLight
          position={[-15, -15, -15]}
          intensity={0.4}
          color="#ffffff"
        />

        {/* Simulation Core */}
        <SimulationCore
          key={particleCount}
          isAnimating={isAnimating}
          speed={speed}
          particleCount={particleCount}
        />

        {/* Camera Controls */}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* Render the Animation Controller */}
      <AnimationController
        isAnimating={isAnimating}
        speed={speed}
        particleCount={particleCount}
        onIsAnimatingChange={handleIsAnimatingChange}
        onSpeedChange={handleSpeedChange}
        onParticleCountChange={handleParticleCountChange}
        maxParticles={MAX_PARTICLES_LIMIT}
      />
    </div>
  );
};

export default ParticleSimulationScene;
