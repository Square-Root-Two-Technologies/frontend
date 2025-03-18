import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./Blogs.css";

// Custom Three.js component for animated shapes
function AnimatedShapes({ index }) {
  const meshRef = useRef();

  // Array of 15 different Three.js geometries with slightly larger base sizes
  const shapeGeometries = [
    { type: "box", geometry: <boxGeometry args={[1.5, 1.5, 1.5]} /> }, // Increased from [1, 1, 1]
    { type: "sphere", geometry: <sphereGeometry args={[1, 32, 32]} /> }, // Increased from 0.7
    {
      type: "cylinder",
      geometry: <cylinderGeometry args={[0.75, 0.75, 1.5, 32]} />,
    }, // Increased dimensions
    { type: "cone", geometry: <coneGeometry args={[0.75, 1.5, 32]} /> }, // Increased dimensions
    { type: "torus", geometry: <torusGeometry args={[0.75, 0.3, 16, 100]} /> }, // Increased radius
    { type: "dodecahedron", geometry: <dodecahedronGeometry args={[1]} /> }, // Increased from 0.7
    { type: "octahedron", geometry: <octahedronGeometry args={[1]} /> }, // Increased from 0.7
    { type: "tetrahedron", geometry: <tetrahedronGeometry args={[1]} /> }, // Increased from 0.7
    { type: "icosahedron", geometry: <icosahedronGeometry args={[1]} /> }, // Increased from 0.7
    {
      type: "torusKnot",
      geometry: <torusKnotGeometry args={[0.75, 0.2, 100, 16]} />,
    }, // Increased radius
    { type: "ring", geometry: <ringGeometry args={[0.5, 0.9, 32]} /> }, // Increased dimensions
    { type: "plane", geometry: <planeGeometry args={[1.5, 1.5]} /> }, // Increased from [1, 1]
    { type: "circle", geometry: <circleGeometry args={[1, 32]} /> }, // Increased from 0.7
    {
      type: "capsule",
      geometry: <capsuleGeometry args={[0.6, 1.2, 16, 32]} />,
    }, // Increased dimensions
    {
      type: "lathe",
      geometry: <latheGeometry args={[getLathePoints(), 12]} />,
    },
  ];

  // Helper function to generate points for latheGeometry (slightly larger)
  function getLathePoints() {
    const points = [];
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.75 + 0.3, i * 0.15)); // Increased scale
    }
    return points;
  }

  const [selectedShape] = useState(() => {
    return shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
  });
  const [speed] = useState(Math.random() * 0.02 + 0.01); // Random rotation speed
  const [color] = useState(() => {
    const colors = ["#a68a64", "#d9b8a2", "#f4e3d3"];
    return colors[Math.floor(Math.random() * colors.length)];
  });
  const [scale] = useState(Math.random() * 1 + 1); // Random scale between 1 and 2 (larger than before)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 1.5;
      meshRef.current.rotation.z += speed * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      {selectedShape.geometry}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Blogs({ selectedOption }) {
  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";
  const navigate = useNavigate();
  const [notesByFilter, setNotesByFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getNotesByType(selectedOption);
  }, [selectedOption]);

  const getNotesByType = async (type) => {
    try {
      const response = await fetch(
        `${host}/api/notes/fetchNotesIrrespectiveByType/${type}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      const notes = await response.json();
      setNotesByFilter(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleReadClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const filteredNotes = notesByFilter.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container fluid className="blogs-container">
      <Row className="align-items-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="blogs-title">Explore Blogs</h2>
        </Col>
        <Col xs={12} md={6}>
          <Form className="blogs-search">
            <Form.Control
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="blogs-search-input"
            />
            <Button variant="outline-light" className="blogs-search-btn">
              Search
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="blogs-grid">
        {filteredNotes.length === 0 ? (
          <Col>
            <p className="text-center text-muted">No blogs to display</p>
          </Col>
        ) : (
          filteredNotes.map((note, index) => (
            <Col xs={12} sm={6} md={4} lg={3} key={note._id} className="mb-4">
              <div className="blog-card">
                <div className="blog-card-animation">
                  <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <AnimatedShapes index={index} />
                    {/* Uncomment OrbitControls if you want user interaction */}
                    {/* <OrbitControls enableZoom={false} /> */}
                  </Canvas>
                </div>
                <div className="blog-card-body">
                  <h5 className="blog-card-title">{note.title}</h5>
                  <Button
                    className="blog-card-btn"
                    onClick={() => handleReadClick(note._id)}
                  >
                    Read
                  </Button>
                </div>
              </div>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default Blogs;
