import React from "react";

const Tabs = ({ activeTab, setActiveTab, types = [] }) => {
  const tabOrder = ["All", ...types.filter((t) => t !== "All")];
  if (tabOrder.length <= 1) return null;

  return (
    <nav
      style={{ marginBottom: "1.75rem", overflowX: "auto", whiteSpace: "nowrap", borderBottom: "1px solid var(--border)" }}
      aria-label="Filter posts by type"
    >
      <ul style={{ display: "flex", gap: 0, margin: 0, padding: 0, listStyle: "none" }}>
        {tabOrder.map((type) => {
          const active = activeTab === type;
          return (
            <li key={type}>
              <button
                onClick={() => setActiveTab(type)}
                aria-current={active ? "page" : undefined}
                style={{
                  padding: "0.625rem 1.125rem",
                  fontSize: "0.8125rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--text)" : "var(--text3)",
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                  cursor: "pointer",
                  transition: "color 0.15s, border-color 0.15s",
                  marginBottom: -1,
                  letterSpacing: active ? 0 : "0.01em",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--text2)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--text3)"; }}
              >
                {type}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Tabs;
