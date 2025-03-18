// AnimatedButtons1.jsx
import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import "./AnimatedButtons1.css";

// Button component
const Button = ({ position, text, onClick, isVisible, scale }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(new THREE.Vector3(...position), 0.1);
    }
  });

  return (
    <group visible={isVisible}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
      >
        <boxGeometry args={[2, 0.5, 0.2]} />
        <meshStandardMaterial
          color={hovered ? "#ff6666" : "#ffffff"}
          emissive="#1a1a1a"
          visible={true}
        />
      </mesh>
      <Text
        position={[0, 0.1, 0.11]} // Relative to the mesh
        fontSize={0.2 * scale}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
};

// Line component
const ConnectionLine = ({ start, end, visible }) => {
  const lineRef = useRef();

  useFrame(() => {
    if (lineRef.current && visible) {
      const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
      lineRef.current.geometry.setFromPoints(points);
    }
  });

  return (
    <line ref={lineRef} visible={visible}>
      <bufferGeometry />
      <lineBasicMaterial color="#ffffff" linewidth={2} />
    </line>
  );
};

const Scene = ({ isFinalState, setIsFinalState }) => {
  const { size, camera } = useThree();
  const aspectRatio = size.width / size.height;

  // Update camera aspect ratio
  useEffect(() => {
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
  }, [size, camera]);

  const MIN_DISTANCE = Math.min(size.width, size.height) * 0.05;
  const MAX_DISTANCE = Math.min(size.width, size.height) * 0.15;

  const getRandomPosition = () => {
    const maxX = (aspectRatio > 1 ? 5 : 5 / aspectRatio) * (size.width / 800);
    const maxY = (aspectRatio > 1 ? 5 / aspectRatio : 5) * (size.height / 600);
    return [
      (Math.random() - 0.5) * maxX * 2,
      (Math.random() - 0.5) * maxY * 2,
      0,
    ];
  };

  const calculateValidPosition = (otherPositions) => {
    let attempts = 0;
    while (attempts < 20) {
      const newPos = getRandomPosition();
      let isValid = true;

      for (const pos of Object.values(otherPositions)) {
        const distance = Math.sqrt(
          Math.pow(newPos[0] - pos[0], 2) + Math.pow(newPos[1] - pos[1], 2),
        );
        if (distance < MIN_DISTANCE || distance > MAX_DISTANCE) {
          isValid = false;
          break;
        }
      }
      if (isValid) return newPos;
      attempts++;
    }
    return getRandomPosition();
  };

  const getNewPositions = () => {
    const getStartedPos = isFinalState ? [0, 0, 0] : getRandomPosition();

    return {
      getStarted: getStartedPos,
      childA: isFinalState
        ? getStartedPos
        : calculateValidPosition({ getStarted: getStartedPos }),
      childB: isFinalState
        ? getStartedPos
        : calculateValidPosition({ getStarted: getStartedPos }),
      childC: isFinalState
        ? getStartedPos
        : calculateValidPosition({ getStarted: getStartedPos }),
    };
  };

  const [positions, setPositions] = useState(() => getNewPositions());

  const handleToggleState = () => {
    setPositions(getNewPositions());
    setIsFinalState(!isFinalState);
  };

  const scale = Math.min(size.width, size.height) / 800;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <Button
        position={positions.getStarted}
        text="Get Started"
        onClick={handleToggleState}
        isVisible={true}
        scale={scale}
      />
      <Button
        position={positions.childA}
        text="Node A"
        isVisible={isFinalState}
        scale={scale}
      />
      <Button
        position={positions.childB}
        text="Node B"
        isVisible={isFinalState}
        scale={scale}
      />
      <Button
        position={positions.childC}
        text="Node C"
        isVisible={isFinalState}
        scale={scale}
      />

      <ConnectionLine
        start={[positions.getStarted[0], positions.getStarted[1], 0.1]}
        end={[positions.childA[0], positions.childA[1], 0.1]}
        visible={isFinalState}
      />
      <ConnectionLine
        start={[positions.getStarted[0], positions.getStarted[1], 0.1]}
        end={[positions.childB[0], positions.childB[1], 0.1]}
        visible={isFinalState}
      />
      <ConnectionLine
        start={[positions.getStarted[0], positions.getStarted[1], 0.1]}
        end={[positions.childC[0], positions.childC[1], 0.1]}
        visible={isFinalState}
      />
    </>
  );
};

const AnimatedButtons1 = () => {
  const [isFinalState, setIsFinalState] = useState(false);
  const containerRef = useRef();

  return (
    <div className="animated-buttons-container" ref={containerRef}>
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        <Scene isFinalState={isFinalState} setIsFinalState={setIsFinalState} />
      </Canvas>
    </div>
  );
};

export default AnimatedButtons1;
