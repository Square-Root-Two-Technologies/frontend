import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import NoteContext from "../../context/notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const NOTE_TYPES = ["JavaScript", "Salesforce", "Sociology", "Life", "Technology", "Creative", "Tutorial", "News"];

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

const EditNote = () => {
  const { notes, editNote, getNotes, isLoading: isNotesLoading } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [note, setNote] = useState({ title: "", description: "", tag: "", type: "", isFeatured: false });
  const [error, setError] = useState("");
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isUserLoading) { setIsComponentLoading(true); return; }
    if (!currentUser) { setError("Authentication required."); setIsComponentLoading(false); return; }
    setIsComponentLoading(true);
    setError("");

    const findNote = (arr) => {
      const found = arr.find((n) => n._id === id);
      if (found) {
        if (found.user._id === currentUser._id || currentUser.role === "admin") {
          setNote({ title: found.title || "", description: found.description || "", tag: found.tag || "", type: found.type || NOTE_TYPES[0], isFeatured: found.isFeatured || false });
          setIsComponentLoading(false);
        } else {
          setError("You don't have permission to edit this post.");
          setIsComponentLoading(false);
        }
      } else {
        setError("Post not found.");
        setIsComponentLoading(false);
      }
    };

    if (notes.length > 0) {
      findNote(notes);
    } else {
      getNotes().then(() => setIsComponentLoading(false)).catch(() => { setError("Failed to load post."); setIsComponentLoading(false); });
    }
  }, [id, notes, currentUser, isUserLoading, getNotes]); // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.title || note.title.length < 3) { setError("Title must be at least 3 characters."); return; }
    if (!note.description || note.description.length < 5) { setError("Content must be at least 5 characters."); return; }
    if (!note.type || !NOTE_TYPES.includes(note.type)) { setError("Please select a valid type."); return; }
    setIsSubmitting(true);
    setError("");
    try {
      await editNote(id, note.title, note.description, note.tag, note.type, currentUser?.role === "admin" ? note.isFeatured : undefined);
      navigate("/my-notes");
    } catch (err) {
      setError(err.message || "Failed to update post.");
    } finally { setIsSubmitting(false); }
  };

  const onChange = (e) => {
    const { name, value, type: t, checked } = e.target;
    setNote({ ...note, [name]: t === "checkbox" ? checked : value });
  };

  if (isUserLoading || isComponentLoading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <LoadingSpinner size="lg" />
    </div>
  );

  if (error && !note.title) return (
    <div style={{ maxWidth: 540, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--text2)", fontStyle: "italic", marginBottom: "1.5rem" }}>{error}</p>
      <Link to="/my-notes" className="btn-primary">← Back to notes</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", margin: 0, letterSpacing: "-0.01em" }}>
          Edit post
        </h1>
      </div>

      {error && note.title && (
        <div style={{ padding: "0.875rem 1rem", background: "rgba(181,112,79,0.1)", borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius) var(--radius) 0", fontSize: "0.875rem", color: "var(--accent)", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {/* Title */}
        <div>
          <label className="field-label" htmlFor="title">Title *</label>
          <input
            type="text" id="title" name="title"
            value={note.title} onChange={onChange}
            style={{ ...inputStyle, fontSize: "1.25rem", fontFamily: "var(--font-serif)" }}
            required minLength="3" disabled={isSubmitting}
            onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
          />
        </div>

        {/* Description */}
        <div>
          <label className="field-label" htmlFor="description">Content *</label>
          <textarea
            id="description" name="description"
            value={note.description} onChange={onChange}
            rows={10}
            style={{ ...inputStyle, resize: "vertical", padding: "0.875rem", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", lineHeight: 1.75, fontSize: "0.9375rem" }}
            required minLength="5" disabled={isSubmitting}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Type + Tag */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label className="field-label" htmlFor="type">Type *</label>
            <select
              id="type" name="type"
              value={note.type} onChange={onChange}
              required disabled={isSubmitting}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
            >
              {NOTE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="tag">Tag <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: "0.75rem", color: "var(--text3)" }}>(optional)</span></label>
            <input
              type="text" id="tag" name="tag"
              value={note.tag} onChange={onChange}
              style={inputStyle}
              placeholder="e.g. React, Deep Work"
              disabled={isSubmitting}
              onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
            />
          </div>
        </div>

        {/* Admin featured */}
        {currentUser?.role === "admin" && (
          <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", fontSize: "0.875rem", color: "var(--text2)" }}>
            <input
              type="checkbox" name="isFeatured"
              checked={note.isFeatured} onChange={onChange}
              disabled={isSubmitting}
              style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
            />
            Mark as featured
          </label>
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ padding: "0.875rem 2rem", fontSize: "0.9375rem", opacity: isSubmitting ? 0.6 : 1 }}
          >
            {isSubmitting ? <LoadingSpinner size="sm" inline /> : "Save changes"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/my-notes")}
            disabled={isSubmitting}
            style={{ padding: "0.875rem 1.5rem", fontSize: "0.9375rem" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
