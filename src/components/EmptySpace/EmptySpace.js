import React from "react";

const EmptyState = ({ message = "Nothing here yet." }) => (
  <div
    style={{
      gridColumn: "1 / -1",
      padding: "4rem 2rem",
      textAlign: "center",
      border: "1px dashed var(--border)",
      borderRadius: "var(--radius)",
    }}
  >
    <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--text2)", marginBottom: "0.5rem", fontStyle: "italic" }}>
      Nothing here yet.
    </p>
    <p style={{ fontSize: "0.875rem", color: "var(--text3)" }}>{message}</p>
  </div>
);

export default EmptyState;
