import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../services/api";

const DIFFICULTY_COLOR = { Easy: "var(--accent)", Medium: "#c98a2b", Hard: "#c94b2b" };

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/judge/problems")
      .then((r) => r.json())
      .then((data) => setProblems(data.problems || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
        ApexJudge
      </h1>
      <p style={{ color: "var(--text2)", marginBottom: "2rem" }}>
        Practice Apex, judged inside your own Salesforce org.
      </p>

      {loading ? (
        <p style={{ color: "var(--text2)" }}>Loading…</p>
      ) : (
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {problems.map((p) => (
            <Link
              key={p.slug}
              to={`/apexjudge/${p.slug}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.875rem 1.25rem",
                textDecoration: "none",
                borderBottom: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <span style={{ fontSize: "0.9375rem" }}>{p.title}</span>
              <span style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {(p.tags || []).map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text3)",
                      background: "var(--bg3)",
                      border: "1px solid var(--border)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "2px",
                    }}
                  >
                    {t}
                  </span>
                ))}
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: DIFFICULTY_COLOR[p.difficulty] || "var(--text2)" }}>
                  {p.difficulty}
                </span>
              </span>
            </Link>
          ))}
          {problems.length === 0 && <p style={{ padding: "1.25rem", color: "var(--text2)" }}>No problems published yet.</p>}
        </div>
      )}
    </div>
  );
};

export default ProblemList;
