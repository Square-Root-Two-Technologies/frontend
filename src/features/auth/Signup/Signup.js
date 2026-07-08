import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import UserContext from "../../../context/user/UserContext";
import { ThemeContext } from "../../../context/ThemeProvider/ThemeProvider";
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
};

const Field = ({ label, id, ...props }) => (
  <div>
    <label className="field-label" htmlFor={id}>{label}</label>
    <input
      id={id}
      style={inputStyle}
      onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
      onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
      {...props}
    />
  </div>
);

const Signup = () => {
  const { signup, googleLogin, isUserLoading } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", country: "", city: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) navigate("/");
    else setError(result.message || "Google sign-in failed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); setIsLoading(false); return; }
    if (!form.country || form.country.length < 2) { setError("Country must be at least 2 characters."); setIsLoading(false); return; }
    if (!form.city) { setError("City is required."); setIsLoading(false); return; }
    try {
      const result = await signup(form.name, form.email, form.password, form.country, form.city);
      if (result.success) navigate("/");
      else setError(result.message || "Signup failed");
    } catch { setError("An unexpected error occurred."); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 400, color: "var(--text)", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
          Create account.
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text2)", marginBottom: "2.5rem" }}>
          Already have one?{" "}
          <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid currentColor" }}>Sign in</Link>
        </p>

        {error && (
          <div style={{ padding: "0.875rem 1rem", background: "rgba(181,112,79,0.1)", borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius) var(--radius) 0", fontSize: "0.875rem", color: "var(--accent)", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Field label="Name" id="name" name="name" type="text" value={form.name} onChange={onChange} placeholder="Your name" required minLength="3" disabled={isLoading || isUserLoading} />
          <Field label="Email" id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required disabled={isLoading || isUserLoading} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Country" id="country" name="country" type="text" value={form.country} onChange={onChange} placeholder="Bangladesh" required minLength="2" disabled={isLoading || isUserLoading} />
            <Field label="City" id="city" name="city" type="text" value={form.city} onChange={onChange} placeholder="Dhaka" required disabled={isLoading || isUserLoading} />
          </div>
          <Field label="Password" id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Min. 5 characters" required minLength="5" disabled={isLoading || isUserLoading} />
          <Field label="Confirm password" id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} placeholder="Repeat password" required minLength="5" disabled={isLoading || isUserLoading} />

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || isUserLoading}
            style={{ width: "100%", padding: "0.875rem", fontSize: "0.9375rem", marginTop: "0.5rem", opacity: (isLoading || isUserLoading) ? 0.6 : 1, cursor: (isLoading || isUserLoading) ? "not-allowed" : "pointer" }}
          >
            {(isLoading || isUserLoading) ? <LoadingSpinner size="sm" inline /> : "Create account"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.75rem 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign-in failed.")}
            theme={theme === "dark" ? "filled_black" : "outline"}
            shape="rectangular"
            width="336"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
