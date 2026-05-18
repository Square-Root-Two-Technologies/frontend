import React from "react";

const LoadingSpinner = ({ size = "md", inline = false }) => {
  const dim = size === "sm" ? 16 : size === "lg" ? 40 : 24;
  const stroke = size === "sm" ? 2 : 2.5;

  const spinner = (
    <span
      style={{
        display: "inline-block",
        width: dim,
        height: dim,
        border: `${stroke}px solid var(--border)`,
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "ep-spin 0.65s linear infinite",
        flexShrink: 0,
      }}
      role="status"
      aria-label="Loading"
    />
  );

  if (inline) return spinner;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
