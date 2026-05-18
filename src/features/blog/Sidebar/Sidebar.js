import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ recentPosts = [] }) => {
  const formatDate = (d) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
    catch { return null; }
  };

  const block = {
    padding: "1.25rem",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    marginBottom: "1rem",
  };

  const blockTitle = {
    fontFamily: "var(--font-sans)",
    fontSize: "0.6875rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text3)",
    marginBottom: "1rem",
  };

  return (
    <aside>
      {recentPosts.length > 0 && (
        <div style={block}>
          <p style={blockTitle}>Recent</p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {recentPosts.map((post) => {
              const d = formatDate(post.date);
              const cat = post.type || post.tag;
              return (
                <li key={post._id}>
                  <Link
                    to={`/blog/${post._id}`}
                    style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 400, color: "var(--text)", textDecoration: "none", lineHeight: 1.3, display: "block", marginBottom: 4 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text)"}
                  >
                    {post.title || "Untitled"}
                  </Link>
                  <div style={{ fontSize: "0.75rem", color: "var(--text3)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    {d && <span>{d}</span>}
                    {cat && d && <span style={{ opacity: 0.4 }}>·</span>}
                    {cat && (
                      <span style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)", opacity: 0.8 }}>
                        {cat}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div style={block}>
        <p style={blockTitle}>About</p>
        <p style={{ fontSize: "0.875rem", color: "var(--text2)", lineHeight: 1.65, margin: 0 }}>
          √2 Technologies — sharing ideas on software, technology, creativity, and the act of building things well.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
