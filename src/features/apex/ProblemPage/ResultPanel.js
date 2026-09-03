import React from "react";

const box = { border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem", background: "var(--bg2)" };

const ResultPanel = ({ submission }) => {
  if (!submission) return null;

  if (submission.outcome === "compile_error") {
    const { line, column, message } = submission.compileError || {};
    return (
      <div style={{ ...box, borderColor: "#c94b2b" }}>
        <div style={{ fontWeight: 600, color: "#c94b2b", marginBottom: "0.5rem" }}>Didn't compile</div>
        <div style={{ fontSize: "0.875rem", color: "var(--text2)", marginBottom: "0.5rem" }}>
          Line {line}, column {column}
        </div>
        <pre style={{ fontSize: "0.8125rem", color: "var(--text)", whiteSpace: "pre-wrap", margin: 0 }}>{message}</pre>
      </div>
    );
  }

  if (submission.outcome === "runtime_error") {
    const { message, stackTrace } = submission.runtimeError || {};
    return (
      <div style={{ ...box, borderColor: "#c94b2b" }}>
        <div style={{ fontWeight: 600, color: "#c94b2b", marginBottom: "0.5rem" }}>Ran into an error</div>
        <pre style={{ fontSize: "0.8125rem", color: "var(--text)", whiteSpace: "pre-wrap", margin: 0 }}>{message}</pre>
        {stackTrace && (
          <pre style={{ fontSize: "0.75rem", color: "var(--text3)", whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>{stackTrace}</pre>
        )}
      </div>
    );
  }

  const { results = [], passedCount, totalCount, allPassed } = submission;
  return (
    <div style={{ ...box, borderColor: allPassed ? "var(--accent)" : "var(--border)" }}>
      <div style={{ fontWeight: 600, color: allPassed ? "var(--accent)" : "var(--text)", marginBottom: "0.75rem" }}>
        {allPassed ? "All tests passed" : `${passedCount} / ${totalCount} tests passed`}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              fontSize: "0.8125rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "2px",
              background: "var(--bg3)",
              color: r.passed ? "var(--text)" : "#c94b2b",
            }}
          >
            <span style={{ fontWeight: 600 }}>{r.passed ? "✓" : "✗"} {r.label}</span>
            {!r.passed && (
              <span style={{ color: "var(--text2)" }}>
                {" — "}
                {r.error ? r.error : `got ${JSON.stringify(r.actual)}`}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPanel;
