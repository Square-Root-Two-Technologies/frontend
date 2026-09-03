import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import UserContext from "../../../context/user/UserContext";
import { ThemeContext } from "../../../context/ThemeProvider/ThemeProvider";
import { api } from "../../../services/api";
import ResultPanel from "./ResultPanel";

const DIFFICULTY_COLOR = { Easy: "var(--accent)", Medium: "#c98a2b", Hard: "#c94b2b" };

const ProblemPage = () => {
  const { slug } = useParams();
  const { currentUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [submission, setSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/api/judge/problems/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.problem) {
          setProblem(data.problem);
          setCode(data.problem.starterCode);
        }
      });
  }, [slug]);

  useEffect(() => {
    if (!currentUser) return;
    api
      .get("/api/judge/salesforce/orgs", true)
      .then((r) => r.json())
      .then((data) => {
        const list = data.orgs || [];
        setOrgs(list);
        if (list.length > 0) setSelectedOrgId(list[0]._id);
      });
  }, [currentUser]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await api.get("/api/judge/salesforce/connect", true);
      const data = await res.json();
      if (data.authorizeUrl) window.location.href = data.authorizeUrl;
    } finally {
      setConnecting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    setSubmission(null);
    try {
      const res = await api.post(
        "/api/judge/submit",
        { problemSlug: slug, code, salesforceOrgId: selectedOrgId },
        true,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed");
      } else {
        setSubmission(data.submission);
      }
    } catch {
      setError("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) return <div style={{ padding: "2.5rem 1.5rem", color: "var(--text2)" }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "1.5rem" }}>
      <div>
        <Link to="/apexjudge" style={{ fontSize: "0.8125rem", color: "var(--text2)", textDecoration: "none" }}>
          ← All problems
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--text)", margin: "0.5rem 0" }}>
          {problem.title}
        </h1>
        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: DIFFICULTY_COLOR[problem.difficulty] }}>
          {problem.difficulty}
        </span>
        <div style={{ marginTop: "1.25rem", fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--text)" }}>
          <ReactMarkdown>{problem.statementMd}</ReactMarkdown>
        </div>

        <h3 style={{ fontSize: "0.9375rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Sample tests</h3>
        {problem.testCases
          .filter((tc) => tc.isSample)
          .map((tc) => (
            <div key={tc.label} style={{ fontSize: "0.8125rem", fontFamily: "monospace", color: "var(--text2)", marginBottom: "0.375rem" }}>
              {tc.invocation} → {tc.expected}
            </div>
          ))}
      </div>

      <div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: "1rem" }}>
          {/* Apex isn't a Monaco-bundled language; Java's tokenizer is close enough for now */}
          <Editor
            height="420px"
            language="java"
            theme={theme === "dark" ? "vs-dark" : "light"}
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{ minimap: { enabled: false }, fontSize: 13 }}
          />
        </div>

        {!currentUser ? (
          <Link to="/login" className="btn-primary" style={{ display: "inline-block", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
            Log in to submit
          </Link>
        ) : orgs.length === 0 ? (
          <button onClick={handleConnect} disabled={connecting} className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
            {connecting ? "Connecting…" : "Connect your Salesforce org"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              style={{ fontSize: "0.8125rem", padding: "0.375rem 0.5rem", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text)" }}
            >
              {orgs.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.username} ({o.orgType})
                </option>
              ))}
            </select>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
              {submitting ? "Running…" : "Submit"}
            </button>
          </div>
        )}

        {error && <div style={{ color: "#c94b2b", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}

        <ResultPanel submission={submission} />
      </div>
    </div>
  );
};

export default ProblemPage;
