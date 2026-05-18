import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/user/UserContext";
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

const EditProfile = () => {
  const { currentUser, isUserLoading, updateUserProfile, getUserDetails } = useContext(UserContext);
  const [formData, setFormData] = useState({ name: "", country: "", city: "", about: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser && !isUserLoading) getUserDetails();
    else if (currentUser) setFormData({
      name: currentUser.name || "",
      country: currentUser.country || "",
      city: currentUser.city || "",
      about: currentUser.about && currentUser.about !== "about is empty" ? currentUser.about : "",
    });
  }, [currentUser, isUserLoading, getUserDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const result = await updateUserProfile({
        name: formData.name,
        country: formData.country,
        city: formData.city,
        about: formData.about,
      });
      if (result) {
        setSuccess("Profile updated.");
        setTimeout(() => navigate("/profile"), 1200);
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (isUserLoading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <LoadingSpinner size="lg" />
    </div>
  );

  if (!currentUser) return (
    <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
      <p style={{ color: "var(--text2)" }}>Unable to load profile.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", marginBottom: "2rem", letterSpacing: "-0.01em" }}>
        Edit profile
      </h1>

      {error && (
        <div style={{ padding: "0.875rem 1rem", background: "rgba(181,112,79,0.1)", borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius) var(--radius) 0", fontSize: "0.875rem", color: "var(--accent)", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: "0.875rem 1rem", background: "rgba(196,184,154,0.15)", borderLeft: "3px solid var(--linen)", borderRadius: "0 var(--radius) var(--radius) 0", fontSize: "0.875rem", color: "var(--text2)", marginBottom: "1.5rem" }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        <div>
          <label className="field-label" htmlFor="name">Name</label>
          <input
            type="text" id="name" name="name"
            value={formData.name} onChange={onChange}
            style={inputStyle} required disabled={isSubmitting}
            onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="country">Country</label>
          <input
            type="text" id="country" name="country"
            value={formData.country} onChange={onChange}
            style={inputStyle} disabled={isSubmitting}
            placeholder="e.g. India"
            onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="city">City</label>
          <input
            type="text" id="city" name="city"
            value={formData.city} onChange={onChange}
            style={inputStyle} disabled={isSubmitting}
            placeholder="e.g. Kolkata"
            onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="about">About</label>
          <textarea
            id="about" name="about"
            value={formData.about} onChange={onChange}
            rows={4}
            style={{ ...inputStyle, resize: "vertical", padding: "0.75rem", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", lineHeight: 1.65 }}
            disabled={isSubmitting}
            placeholder="A few words about yourself…"
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ flex: 1, padding: "0.875rem", fontSize: "0.9375rem", opacity: isSubmitting ? 0.6 : 1 }}
          >
            {isSubmitting ? <LoadingSpinner size="sm" inline /> : "Save changes"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/profile")}
            disabled={isSubmitting}
            style={{ flex: 1, padding: "0.875rem", fontSize: "0.9375rem" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
