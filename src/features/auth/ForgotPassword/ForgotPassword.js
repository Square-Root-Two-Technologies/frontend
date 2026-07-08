import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${host}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.errors?.[0]?.msg || data.error || "Something went wrong.");
      } else {
        setSubmitted(true);
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
          Reset password.
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text2)", marginBottom: "2.5rem" }}>
          <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid currentColor" }}>← Back to login</Link>
        </p>

        {submitted ? (
          <div style={{ padding: "0.875rem 1rem", background: "var(--bg3)", borderLeft: "3px solid var(--linen)", borderRadius: "0 var(--radius) var(--radius) 0", fontSize: "0.875rem", color: "var(--text2)" }}>
            If an account exists for that email, we've sent a link to reset your password. Check your inbox.
          </div>
        ) : (
          <>
            <p style={{ fontSize: "0.875rem", color: "var(--text2)", marginBottom: "1.75rem" }}>
              Enter your email and we'll send you a link to set a new password.
            </p>

            {error && (
              <div style={{ padding: "0.875rem 1rem", background: "rgba(181,112,79,0.1)", borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius) var(--radius) 0", fontSize: "0.875rem", color: "var(--accent)", marginBottom: "1.5rem" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              <div>
                <label className="field-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="you@example.com"
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
                {isLoading ? <LoadingSpinner size="sm" inline /> : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
