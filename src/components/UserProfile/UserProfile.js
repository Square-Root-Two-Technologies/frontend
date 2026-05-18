import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const Row = ({ label, value }) => (
  <div style={{ paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)" }}>
    <p className="field-label">{label}</p>
    <p style={{ fontSize: "1rem", color: "var(--text)", margin: 0, fontFamily: "var(--font-serif)", fontWeight: 400 }}>{value || "—"}</p>
  </div>
);

const UserProfile = () => {
  const { currentUser, isUserLoading, getUserDetails } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser && !isUserLoading) getUserDetails();
  }, [currentUser, isUserLoading, getUserDetails]);

  if (isUserLoading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <LoadingSpinner size="lg" />
    </div>
  );

  if (!currentUser) return (
    <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
      <p style={{ fontSize: "1rem", color: "var(--text2)" }}>Unable to load profile.</p>
    </div>
  );

  const initials = currentUser.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "3rem 1.5rem" }}>
      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {currentUser.profilePictureUrl
          ? <img src={currentUser.profilePictureUrl} alt={currentUser.name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
          : (
            <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--text2)", flexShrink: 0 }}>
              {initials}
            </span>
          )
        }
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--text)", margin: "0 0 0.25rem" }}>
            {currentUser.name}
          </h1>
          {currentUser.role === "admin" && (
            <span className="type-pill">Admin</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <Row label="Email" value={currentUser.email} />
        {currentUser.country && <Row label="Country" value={currentUser.country} />}
        {currentUser.city && <Row label="City" value={currentUser.city} />}
        {currentUser.about && currentUser.about !== "about is empty" && (
          <div style={{ paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)" }}>
            <p className="field-label">About</p>
            <p style={{ fontSize: "0.9375rem", color: "var(--text2)", margin: 0, lineHeight: 1.65 }}>{currentUser.about}</p>
          </div>
        )}
        <Row label="Member since" value={new Date(currentUser.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })} />
      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}>
        <Link to="/edit-profile" className="btn-primary">Edit profile</Link>
        <Link to="/my-notes" className="btn-secondary">My notes</Link>
      </div>
    </div>
  );
};

export default UserProfile;
