import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../../context/user/UserContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const Login = () => {
  const { login, isUserLoading } = useContext(UserContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from?.pathname === "/my-notes") setInfo("Please log in to manage your notes.");
    else if (location.state?.from) setInfo(`Please log in to access ${location.state.from.pathname}.`);
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await login(credentials.email, credentials.password);
      if (result.success) {
        navigate(location.state?.from?.pathname || "/", { replace: true });
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 400, color: "var(--text)", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
          Welcome back.
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text2)", marginBottom: "2.5rem" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid currentColor" }}>Sign up</Link>
        </p>

        {info && (
          <div style={{ padding: "0.875rem 1rem", background: "var(--bg3)", borderLeft: "3px solid var(--linen)", borderRadius: "0 var(--radius) var(--radius) 0", fontSize: "0.875rem", color: "var(--text2)", marginBottom: "1.5rem" }}>
            {info}
          </div>
        )}
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
              name="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              style={inputStyle}
              placeholder="you@example.com"
              required
              disabled={isLoading || isUserLoading}
              onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              style={inputStyle}
              placeholder="••••••••"
              required
              disabled={isLoading || isUserLoading}
              onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || isUserLoading}
            style={{ width: "100%", padding: "0.875rem", fontSize: "0.9375rem", marginTop: "0.5rem", opacity: (isLoading || isUserLoading) ? 0.6 : 1, cursor: (isLoading || isUserLoading) ? "not-allowed" : "pointer" }}
          >
            {(isLoading || isUserLoading) ? <LoadingSpinner size="sm" inline /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
