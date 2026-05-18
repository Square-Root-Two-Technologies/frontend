import React from "react";
import { Link } from "react-router-dom";

const linkStyle = {
  color: "var(--text3)",
  textDecoration: "none",
  transition: "color 0.15s",
};

const Breadcrumbs = ({ path = [], currentTitle }) => {
  return (
    <nav aria-label="Breadcrumb" style={{ fontSize: "0.8125rem", color: "var(--text3)", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.25rem", marginBottom: "1.25rem" }}>
      <Link
        to="/"
        style={linkStyle}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}
      >
        Home
      </Link>

      {path.map((item) => (
        <React.Fragment key={item._id}>
          <span style={{ opacity: 0.4, userSelect: "none" }}>›</span>
          <Link
            to={`/category/${item._id}`}
            style={linkStyle}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}
            title={`Browse ${item.name}`}
          >
            {item.name}
          </Link>
        </React.Fragment>
      ))}

      {currentTitle && (
        <>
          <span style={{ opacity: 0.4, userSelect: "none" }}>›</span>
          <span style={{ color: "var(--text2)" }}>{currentTitle}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;
