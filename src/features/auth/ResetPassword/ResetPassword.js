import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const inputStyle = {
  width: "100%",
  padding: "0.75rem 0",
  fontSize: "1rem",
  fontFamily: "var(--font-sans)",
  color: "var(--text)",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--border)",
  outline: "none",
  transition: "border-color var(--transition)",
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 5) { setError("Password must be at least 5 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }

    setIsLoading(true);
    try {
      const response = await fetch(`${host}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.errors?.[0]?.msg || data.error || "Something went wrong.");
      } else {
        navigate("/login", { state: { from: null } });
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 400, color: "var(--text)", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
          Set a new password.
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text2)", marginBottom: "2.5rem" }}>
          <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid currentColor" }}>← Back to login</Link>
        </p>

        {error && (
          <div style={{ padding: "0.875rem 1rem", background: "rgba(181,112,79,0.1)", borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius) var(--radius) 0", fontSize: "0.875rem", color: "var(--accent)", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <div>
            <label className="field-label" htmlFor="password">New password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
              disabled={isLoading}
              onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="confirmPassword">Confirm new password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
              disabled={isLoading}
              onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: "100%", padding: "0.875rem", fontSize: "0.9375rem", marginTop: "0.5rem", opacity: isLoading ? 0.6 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            {isLoading ? <LoadingSpinner size="sm" inline /> : "Set new password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
