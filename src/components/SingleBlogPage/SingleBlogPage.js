import React, { useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

const SingleBlogPage = () => {
  const { id } = useParams();
  const { note, getNoteById, isFetchingNote, singleNoteError } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if ((!note || note._id !== id) && !isFetchingNote) {
      getNoteById(id);
    }
  }, [id, getNoteById]); // eslint-disable-line

  if (isFetchingNote || isUserLoading || (!note && !singleNoteError)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (singleNoteError) {
    return (
      <div style={{ maxWidth: 540, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--text2)", marginBottom: "1.5rem", fontStyle: "italic" }}>
          Couldn't load this post.
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--text3)", marginBottom: "1.5rem" }}>{singleNoteError}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => getNoteById(id)}>Try again</button>
          <Link to="/home" className="btn-secondary">← All posts</Link>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div style={{ maxWidth: 540, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--text2)", marginBottom: "1.5rem", fontStyle: "italic" }}>
          Post not found.
        </p>
        <Link to="/home" className="btn-primary">← All posts</Link>
      </div>
    );
  }

  const { title, description, tag, type, readTimeMinutes, user, date } = note;
  const authorName = user?.name || "Unknown";
  const label = type || tag;
  const canEdit = !isUserLoading && currentUser && user && (currentUser._id === user._id || currentUser.role === "admin");

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>

      {/* Back */}
      <Link to="/home" style={{ fontSize: "0.8125rem", color: "var(--text3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2.5rem", letterSpacing: "0.02em" }}>
        ← All posts
      </Link>

      {/* Type */}
      {label && <span className="type-pill" style={{ display: "inline-block", marginBottom: "1rem" }}>{label}</span>}

      {/* Title */}
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.1, letterSpacing: "-0.01em", margin: "0 0 1.5rem" }}>
        {title}
      </h1>

      {/* Meta */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem", alignItems: "center", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2.5rem", fontSize: "0.875rem", color: "var(--text3)" }}>
        {user?.profilePictureUrl
          ? <img src={user.profilePictureUrl} alt={authorName} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
          : <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--linen)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 600, color: "var(--text2)", flexShrink: 0 }}>{authorName[0]?.toUpperCase()}</span>
        }
        <span style={{ color: "var(--text2)" }}>{authorName}</span>
        {date && <><span style={{ opacity: 0.4 }}>·</span><time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time></>}
        {readTimeMinutes && <><span style={{ opacity: 0.4 }}>·</span><span>{readTimeMinutes} min read</span></>}

        {canEdit && (
          <button
            onClick={() => navigate(`/edit-note/${id}`)}
            className="btn-secondary"
            style={{ marginLeft: "auto", padding: "0.25rem 0.75rem", fontSize: "0.8rem" }}
          >
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      <div
        style={{ fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.8, color: "var(--text)" }}
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description || "<p>No content available.</p>") }}
      />

      {/* Bottom nav */}
      <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
        <Link to="/home" style={{ fontSize: "0.8125rem", color: "var(--text3)", textDecoration: "none" }}>
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
};

export default SingleBlogPage;
