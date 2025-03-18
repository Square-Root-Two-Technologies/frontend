import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SpaceScene from "../Astronomy/SpaceScene"; // Assuming this exists

const HomeScreenWithAnimation = () => {
  const canvasRef = useRef(null);
  const rightSectionRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const animationRef = useRef(null);

  const EXPAND_SPEED = 0.05;
  const RETRACT_SPEED = 0.05;

  const animateCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rightSection = rightSectionRef.current;
    if (!canvas || !ctx || !rightSection) return;

    const rightRect = rightSection.getBoundingClientRect();
    canvas.width = rightRect.width;
    canvas.height = rightRect.height;

    const margin = 50;
    const nodes = [
      {
        name: "Automation",
        targetX: rightRect.width / 2,
        targetY: margin,
        color: "#FF8A65",
      },
      {
        name: "Games",
        targetX: rightRect.width - margin,
        targetY: rightRect.height / 3,
        color: "#64B5F6",
      },
      {
        name: "AI",
        targetX: rightRect.width - margin,
        targetY: (2 * rightRect.height) / 3,
        color: "#CE93D8",
      },
      {
        name: "Software",
        targetX: rightRect.width / 2,
        targetY: rightRect.height - margin,
        color: "#FFD54F",
      },
    ];

    const initialStartPos = {
      x: rightRect.width / 2,
      y: rightRect.height / 2 + 50,
    };
    let startPos = { ...initialStartPos };
    let currentPositions = nodes.map(() => ({ x: startPos.x, y: startPos.y }));
    let lineLengths = nodes.map(() => 0);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw root button
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = "#a68a64";
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Get Started", startPos.x, startPos.y + 4);
      ctx.shadowBlur = 0;

      // Draw nodes and lines
      nodes.forEach((node, index) => {
        const pos = currentPositions[index];
        const lineLength = lineLengths[index];

        const angle = Math.atan2(pos.y - startPos.y, pos.x - startPos.x);
        const lineEndX = startPos.x + Math.cos(angle) * lineLength;
        const lineEndY = startPos.y + Math.sin(angle) * lineLength;

        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `${node.color}80`;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "white";
        ctx.font = "bold 12px Arial";
        ctx.fillText(node.name, pos.x, pos.y + 4);
      });
    };

    const animate = () => {
      const rect = rightSection.getBoundingClientRect();
      const speed = isExpanded ? EXPAND_SPEED : RETRACT_SPEED;
      let isAnimating = false;

      // Update button position
      const targetStartX = isExpanded ? rect.width - margin : rect.width / 2;
      const targetStartY = isExpanded ? margin : rect.height / 2 + 50;
      const dxStart = (targetStartX - startPos.x) * speed;
      const dyStart = (targetStartY - startPos.y) * speed;

      if (Math.abs(dxStart) > 0.1 || Math.abs(dyStart) > 0.1) {
        startPos.x += dxStart;
        startPos.y += dyStart;
        isAnimating = true;
      } else {
        startPos.x = targetStartX;
        startPos.y = targetStartY;
      }

      // Update node positions
      currentPositions = currentPositions.map((pos, index) => {
        const targetX = isExpanded ? nodes[index].targetX : initialStartPos.x;
        const targetY = isExpanded ? nodes[index].targetY : initialStartPos.y;
        const dx = (targetX - pos.x) * speed;
        const dy = (targetY - pos.y) * speed;

        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          isAnimating = true;
          return { x: pos.x + dx, y: pos.y + dy };
        }
        return { x: targetX, y: targetY };
      });

      // Update line lengths
      lineLengths = lineLengths.map((length, index) => {
        const targetLength = isExpanded
          ? Math.sqrt(
              (nodes[index].targetX - startPos.x) ** 2 +
                (nodes[index].targetY - startPos.y) ** 2,
            )
          : 0;
        const dl = (targetLength - length) * speed;

        if (Math.abs(dl) > 0.1) {
          isAnimating = true;
          return length + dl;
        }
        return targetLength;
      });

      draw();

      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    // Initial draw
    draw();
    // Start animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

  useEffect(() => {
    const cleanup = animateCanvas();

    const handleResize = () => {
      if (canvasRef.current && rightSectionRef.current) {
        const canvas = canvasRef.current;
        const rightSection = rightSectionRef.current;
        const rect = rightSection.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (cleanup) cleanup();
      window.removeEventListener("resize", handleResize);
    };
  }, [isExpanded]);

  return (
    <div>
      <div
        className="container-fluid d-flex flex-column vh-100"
        style={{ overflow: "hidden", backgroundColor: "#1a1a1a" }}
      >
        <div
          className="d-flex flex-column flex-lg-row flex-grow-1 p-3"
          style={{ height: "100%" }}
        >
          <div
            id="left-section"
            className="col-lg-6 col-12 mb-3 mb-lg-0 p-4 rounded d-flex flex-column"
            style={{ flex: "1", overflow: "auto", backgroundColor: "#1a1a1a" }}
          >
            <SpaceScene />
          </div>

          <div
            id="right-section"
            ref={rightSectionRef}
            className="col-lg-6 col-12 p-4 rounded shadow d-flex flex-column justify-content-center align-items-center"
            style={{
              flex: "1",
              overflow: "hidden",
              backgroundColor: "#1a1a1a",
              position: "relative",
            }}
          >
            {!isExpanded && (
              <div
                id="right-content"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  transition: "opacity 0.3s ease",
                  opacity: isExpanded ? 0 : 1,
                  pointerEvents: "auto",
                  zIndex: 10,
                }}
              >
                <h1 style={{ color: "#f4e3d3", fontSize: "2.5rem" }}>
                  Square Root Two Technologies
                </h1>
                <p style={{ color: "#d9b8a2", fontSize: "1.25rem" }}>
                  Finite problems | Infinite Solutions
                </p>
                <button
                  className="btn"
                  onClick={() => setIsExpanded(true)}
                  style={{
                    backgroundColor: "#a68a64",
                    color: "#ffffff",
                    border: "none",
                    padding: "5px 15px",
                    fontSize: "0.875rem",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Get Started
                </button>
              </div>
            )}
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 5,
              }}
              onClick={(e) => {
                const canvas = canvasRef.current;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const startPos = {
                  x: isExpanded ? rect.width - 50 : rect.width / 2,
                  y: isExpanded ? 50 : rect.height / 2 + 50,
                };
                const distance = Math.sqrt(
                  (x - startPos.x) ** 2 + (y - startPos.y) ** 2,
                );
                if (distance <= 25) {
                  // 25 is the button radius
                  setIsExpanded((prev) => !prev);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="container-fluid d-flex flex-column align-items-center justify-content-center p-5"
        style={{
          minHeight: "100vh",
          backgroundColor: "#1a1a1a",
          color: "#f4e3d3",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>About Us</h2>
        <p style={{ maxWidth: "800px", fontSize: "1.5rem", color: "#d9b8a2" }}>
          At Square Root Two Technologies, we believe that every problem has an
          infinite number of solutions. Our mission is to innovate and create
          cutting-edge technology solutions that push the boundaries of
          possibility.
        </p>
        <p style={{ maxWidth: "800px", fontSize: "1.5rem", color: "#d9b8a2" }}>
          We specialize in automation, games, artificial intelligence, and
          software development—bringing futuristic ideas to life.
        </p>
      </div>
    </div>
  );
};

export default HomeScreenWithAnimation;
