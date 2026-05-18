import React from "react";

const Tabs = ({ activeTab, setActiveTab, types = [] }) => {
  const tabOrder = ["All", ...types.filter((t) => t !== "All")];
  if (tabOrder.length <= 1) return null;

  return (
    <nav
      style={{ marginBottom: "1.5rem", overflowX: "auto", whiteSpace: "nowrap", borderBottom: "1px solid var(--border)" }}
      aria-label="Filter by type"
    >
      <ul style={{ display: "flex", gap: "0", margin: 0, padding: 0, listStyle: "none" }}>
        {tabOrder.map((type) => {
          const active = activeTab === type;
          return (
            <li key={type}>
              <button
                onClick={() => setActiveTab(type)}
                aria-current={active ? "page" : undefined}
                style={{
                  padding: "0.75rem 1rem",
                  fontSize: "0.8125rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: active ? 500 : 400,
                  color: active ? "var(--accent)" : "var(--text3)",
                  background: "none",
                  border: "none",
                  borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "color var(--transition), border-color var(--transition)",
                  marginBottom: -1,
                  letterSpacing: active ? 0 : "0.01em",
                }}
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
