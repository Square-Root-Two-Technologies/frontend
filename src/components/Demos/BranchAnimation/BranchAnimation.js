import React, { useState, useEffect, useRef } from "react";

const BranchAnimation = () => {
  const canvasRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const animationRef = useRef(null);
  const [clickedNode, setClickedNode] = useState(null);

  const nodes = [
    { name: "JavaScript", targetX: 200, targetY: 50, color: "#FF8A65" },
    { name: "Salesforce", targetX: 300, targetY: 125, color: "#64B5F6" },
    {
      name: "Salesforce Maps & Sales Management",
      targetX: 300,
      targetY: 275,
      color: "#CE93D8",
    },
    { name: "Sociology", targetX: 200, targetY: 350, color: "#FFD54F" },
  ];

  const EXPAND_SPEED = 0.05;
  const RETRACT_SPEED = 0.005;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let startPos = { x: canvas.width / 2, y: canvas.height / 2 };
    let currentPositions = nodes.map(() => ({ x: startPos.x, y: startPos.y }));
    let lineLengths = nodes.map(() => 0);

    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = "#81C784";
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Start", startPos.x, startPos.y + 5);
      ctx.shadowBlur = 0;

      if (isOpen || lineLengths.some((len) => len > 0.01)) {
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
      }
    };

    const animate = () => {
      let isAnimating = false;
      const speed = isOpen ? EXPAND_SPEED : RETRACT_SPEED;

      const targetStartX = isOpen ? canvas.width * 0.25 : canvas.width / 2;
      const dxStart = (targetStartX - startPos.x) * speed;
      if (Math.abs(dxStart) > 0.01) {
        startPos.x += dxStart;
        isAnimating = true;
      } else {
        startPos.x = targetStartX;
      }

      currentPositions = currentPositions.map((pos, index) => {
        const targetX = isOpen ? nodes[index].targetX : startPos.x;
        const targetY = isOpen ? nodes[index].targetY : startPos.y;
        const dx = (targetX - pos.x) * speed;
        const dy = (targetY - pos.y) * speed;

        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
          isAnimating = true;
          return { x: pos.x + dx, y: pos.y + dy };
        }
        return { x: targetX, y: targetY };
      });

      lineLengths = lineLengths.map((length, index) => {
        const targetLength = isOpen
          ? Math.sqrt(
              (nodes[index].targetX - startPos.x) ** 2 +
                (nodes[index].targetY - startPos.y) ** 2,
            )
          : 0;
        const dl = (targetLength - length) * speed;

        if (Math.abs(dl) > 0.01) {
          isAnimating = true;
          return length + dl;
        }
        return targetLength;
      });

      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    draw();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ cursor: "pointer", background: "black" }}
        onClick={() => setIsOpen((prev) => !prev)}
      />
    </div>
  );
};

export default BranchAnimation;
