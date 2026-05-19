import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ThemeContext } from "../../context/ThemeProvider/ThemeProvider";

const G = 0.6;
const BOX_SIZE = 10;
const PARTICLE_RADIUS = 0.3;
const MIN_DISTANCE_FOR_LINES = 0.5;
const MAX_PARTICLES = 20;

const generateParticles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `P${i + 1}`,
    mass: Math.random() * 10 + 5,
    position: new THREE.Vector3(
      (Math.random() - 0.5) * BOX_SIZE * 1.5,
      (Math.random() - 0.5) * BOX_SIZE * 1.5,
      (Math.random() - 0.5) * BOX_SIZE * 1.5,
    ),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
    ),
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
  }));

/* Runs inside Canvas context — updates background colour reactively */
function SceneBackground({ color }) {
  const { gl } = useThree();
  useEffect(() => { gl.setClearColor(color); }, [color, gl]);
  return null;
}

/* Core physics + render loop */
function SimulationCore({ speed, isAnimating, particleCount, wireColor, labelColor }) {
  const particles = useRef(generateParticles(particleCount));
  const meshRefs = useRef([]);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    particles.current = generateParticles(particleCount);
    meshRefs.current = new Array(particleCount);
    setLines([]);
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!isAnimating) return;
    const dt = delta * 60;
    const eff = speed * dt;
    const newLines = [];

    for (let i = 0; i < particles.current.length; i++) {
      for (let j = i + 1; j < particles.current.length; j++) {
        const p1 = particles.current[i];
        const p2 = particles.current[j];
        if (!p1 || !p2) continue;
        const diff = p2.position.clone().sub(p1.position);
        const distSq = diff.lengthSq();
        const dist = Math.sqrt(distSq);
        if (dist < PARTICLE_RADIUS * 2) continue;
        const forceMag = (G * p1.mass * p2.mass) / (distSq + 0.1);
        const dir = diff.normalize();
        const force = dir.clone().multiplyScalar(forceMag * eff);
        p1.velocity.add(force.clone().divideScalar(p1.mass));
        p2.velocity.sub(force.clone().divideScalar(p2.mass));
        if (dist > MIN_DISTANCE_FOR_LINES) {
          newLines.push({
            start: p1.position.clone().add(dir.clone().multiplyScalar(PARTICLE_RADIUS)),
            end: p2.position.clone().sub(dir.clone().multiplyScalar(PARTICLE_RADIUS)),
            strength: forceMag,
          });
        }
      }
    }

    particles.current.forEach((p, idx) => {
      if (!p) return;
      p.position.add(p.velocity.clone().multiplyScalar(eff));
      ["x", "y", "z"].forEach((axis) => {
        if (Math.abs(p.position[axis]) > BOX_SIZE) {
          p.position[axis] = Math.sign(p.position[axis]) * BOX_SIZE;
          p.velocity[axis] *= -0.7;
        }
      });
      if (meshRefs.current[idx]) meshRefs.current[idx].position.copy(p.position);
    });

    setLines(newLines);
  });

  return (
    <>
      <mesh>
        <boxGeometry args={[BOX_SIZE * 2, BOX_SIZE * 2, BOX_SIZE * 2]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.2} />
      </mesh>

      {particles.current.map((p, idx) => p && (
        <mesh key={p.id} ref={(el) => (meshRefs.current[idx] = el)} position={p.position}>
          <sphereGeometry args={[PARTICLE_RADIUS, 16, 16]} />
          <meshStandardMaterial color={p.color} roughness={0.5} metalness={0.1} />
          <Text
            position={[PARTICLE_RADIUS + 0.1, PARTICLE_RADIUS + 0.1, 0]}
            fontSize={0.2}
            color={labelColor}
            anchorX="left"
            anchorY="bottom"
            outlineWidth={0.01}
            outlineColor={wireColor}
          >
            {p.name}
          </Text>
        </mesh>
      ))}

      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color={wireColor}
          lineWidth={Math.max(0.5, line.strength * 0.1)}
          opacity={0.5}
          transparent
        />
      ))}
    </>
  );
}

/* Floating controls panel — bottom-right of the canvas */
function Controls({ isAnimating, speed, particleCount, onToggle, onSpeed, onCount }) {
  const [open, setOpen] = useState(false);

  const base = {
    position: "absolute",
    bottom: 12,
    right: 12,
    zIndex: 20,
    background: "rgba(30,26,20,0.85)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.45)",
    color: "#E5E7EB",
    fontFamily: "var(--font-sans)",
    fontSize: "0.8125rem",
  };

  const gearBtn = {
    width: 38, height: 38,
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "none", border: "none", color: "#E5E7EB",
    cursor: "pointer", fontSize: 17,
  };

  const labelStyle = { display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontWeight: 500, color: "#D1D5DB" };
  const sliderStyle = { width: "100%", cursor: "pointer", accentColor: "#C4865C" };
  const smallBtn = {
    padding: "4px 10px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
    color: "#E5E7EB", borderRadius: 4, cursor: "pointer", fontSize: "0.75rem",
  };

  if (!open) {
    return (
      <div style={{ ...base, borderRadius: "50%" }}>
        <button style={gearBtn} onClick={() => setOpen(true)} aria-label="Open controls">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...base, borderRadius: 10, width: 210, padding: "12px 14px 14px" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          style={{ ...smallBtn, display: "flex", alignItems: "center", gap: 6, padding: "4px 12px" }}
          onClick={onToggle}
          aria-label={isAnimating ? "Pause" : "Play"}
        >
          {isAnimating ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          style={{ ...smallBtn, padding: "4px 10px", lineHeight: 1 }}
          onClick={() => setOpen(false)}
          aria-label="Close controls"
        >
          ✕
        </button>
      </div>

      {/* Speed */}
      <div style={{ marginBottom: 12 }}>
        <div style={labelStyle}>
          <span>⚡</span>
          <span>Speed: {speed.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min={0.001} max={0.1} step={0.001}
          value={speed}
          onChange={(e) => onSpeed(parseFloat(e.target.value))}
          style={sliderStyle}
        />
      </div>

      {/* Particles */}
      <div>
        <div style={labelStyle}>
          <span>●</span>
          <span>Particles: {particleCount} / {MAX_PARTICLES}</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button style={smallBtn} disabled={particleCount <= 2}
            onClick={() => onCount(particleCount - 1)} aria-label="Remove particle">−</button>
          <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
            <div style={{ width: `${(particleCount / MAX_PARTICLES) * 100}%`, height: "100%", background: "#C4865C", borderRadius: 2, transition: "width 0.15s" }} />
          </div>
          <button style={smallBtn} disabled={particleCount >= MAX_PARTICLES}
            onClick={() => onCount(particleCount + 1)} aria-label="Add particle">+</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ── */
const ParticleSimulation = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [speed, setSpeed] = useState(0.05);
  const [particleCount, setParticleCount] = useState(5);
  const { theme } = useContext(ThemeContext);

  const bgColor    = useMemo(() => theme === "dark" ? "#13110E" : "#F7F4EF", [theme]);
  const wireColor  = useMemo(() => theme === "dark" ? "#57534E" : "#C4B89A", [theme]);
  const labelColor = useMemo(() => theme === "dark" ? "#A8A29E" : "#6B6560", [theme]);

  const handleCount = useCallback(
    (n) => setParticleCount(Math.min(MAX_PARTICLES, Math.max(2, n))),
    [],
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 38], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: false }}
      >
        <SceneBackground color={bgColor} />
        <ambientLight intensity={0.6} />
        <pointLight position={[15, 15, 15]} intensity={0.8} />
        <pointLight position={[-15, -15, -15]} intensity={0.4} />
        <SimulationCore
          key={particleCount}
          isAnimating={isAnimating}
          speed={speed}
          particleCount={particleCount}
          wireColor={wireColor}
          labelColor={labelColor}
        />
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>

      <Controls
        isAnimating={isAnimating}
        speed={speed}
        particleCount={particleCount}
        onToggle={() => setIsAnimating((p) => !p)}
        onSpeed={setSpeed}
        onCount={handleCount}
      />
    </div>
  );
};

export default ParticleSimulation;
