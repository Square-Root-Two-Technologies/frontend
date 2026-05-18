import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";

/* Recursive sub-category row shown inside each card */
const SubList = ({ children }) => {
  if (!children || children.length === 0) return null;
  return (
    <ul style={{ listStyle: "none", margin: "0.75rem 0 0", padding: "0.75rem 0 0", borderTop: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
      {children.map((child) => (
        <li key={child._id}>
          <Link
            to={`/category/${child._id}`}
            style={{ fontSize: "0.75rem", color: "var(--text3)", textDecoration: "none", padding: "0.125rem 0.5rem", border: "1px solid var(--border)", borderRadius: "2px", display: "inline-block", lineHeight: 1.6, transition: "color 0.15s, border-color 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            {child.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

/* Top-level category card */
const CategoryCard = ({ cat }) => (
  <Link
    to={`/category/${cat._id}`}
    style={{ display: "flex", flexDirection: "column", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem 1.5rem", textDecoration: "none", color: "inherit", transition: "box-shadow 0.15s" }}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
  >
    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 400, color: "var(--text)", margin: "0 0 0.375rem", lineHeight: 1.2 }}>
      {cat.name}
    </h2>
    {cat.description && (
      <p style={{ fontSize: "0.875rem", color: "var(--text2)", margin: "0 0 0.25rem", lineHeight: 1.6, flexGrow: 1 }}>
        {cat.description}
      </p>
    )}
    {cat.children && cat.children.length > 0 && (
      <SubList children={cat.children} />
    )}
  </Link>
);

const CategoriesPage = () => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${host}/api/categories/tree/structured`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTree(data.categoryTree);
        else setError("Failed to load categories.");
        setLoading(false);
      })
      .catch(() => { setError("Network error loading categories."); setLoading(false); });
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <nav style={{ fontSize: "0.8125rem", color: "var(--text3)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <Link to="/home" style={{ color: "var(--text3)", textDecoration: "none" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}>
            Read
          </Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: "var(--text2)" }}>Topics</span>
        </nav>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", margin: 0, letterSpacing: "-0.01em" }}>
          Topics
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text2)", marginTop: "0.5rem", marginBottom: 0 }}>
          Browse all categories of writing.
        </p>
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <p style={{ color: "var(--accent)", fontSize: "0.9375rem", padding: "2rem 0" }}>{error}</p>
      )}

      {!loading && !error && tree.length === 0 && (
        <p style={{ color: "var(--text3)", fontStyle: "italic", fontSize: "0.9375rem", padding: "2rem 0" }}>
          No topics yet.
        </p>
      )}

      {!loading && !error && tree.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {tree.map((cat) => (
            <CategoryCard key={cat._id} cat={cat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
