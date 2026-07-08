import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import NoteContext from "../../../context/Notes/NoteContext";
import UserContext from "../../../context/user/UserContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link2 from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import MenuBar from "../../../components/EditorToolbar/MenuBar";

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
  const { notes, editNote, getNotes } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [noteTitle, setNoteTitle] = useState("");
  const [noteTag, setNoteTag] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [noteIsFeatured, setNoteIsFeatured] = useState(false);
  const [noteIsActive, setNoteIsActive] = useState(true);
  const [error, setError] = useState("");
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [editorReady, setEditorReady] = useState(false);

  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Placeholder.configure({ placeholder: "Edit your post…" }),
      Link2.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
    ],
    content: "",
    editorProps: {
      attributes: {
        style: "min-height:400px;padding:1rem 1.25rem;outline:none;font-family:var(--font-sans);font-size:1.0625rem;line-height:1.8;color:var(--text);background:var(--bg2);border:1px solid var(--border);border-top:none;border-radius:0 0 var(--radius) var(--radius);",
      },
    },
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  useEffect(() => {
    fetch(`${host}/api/categories`)
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : (data?.categories || []));
        setCategoriesLoading(false);
      })
      .catch(() => setCategoriesLoading(false));
  }, [host]);

  useEffect(() => {
    if (isUserLoading) { setIsComponentLoading(true); return; }
    if (!currentUser) { setError("Authentication required."); setIsComponentLoading(false); return; }
    setIsComponentLoading(true);
    setError("");

    const loadNote = (arr) => {
      const found = arr.find((n) => n._id === id);
      if (!found) { setError("Post not found."); setIsComponentLoading(false); return; }
      if (found.user._id !== currentUser._id && currentUser.role !== "admin" && currentUser.role !== "SuperAdmin") {
        setError("You don't have permission to edit this post.");
        setIsComponentLoading(false);
        return;
      }
      setNoteTitle(found.title || "");
      setNoteTag(found.tag || "");
      setCategoryId(found.category?._id || found.category || "");
      setNoteIsFeatured(found.isFeatured || false);
      setNoteIsActive(found.isActive !== undefined ? found.isActive : true);
      if (editor && !editorReady) {
        editor.commands.setContent(found.description || "");
        setEditorReady(true);
      }
      setIsComponentLoading(false);
    };

    if (notes.length > 0) {
      loadNote(notes);
    } else {
      getNotes().then((fetched) => {
        if (fetched) loadNote(fetched);
        else { setError("Failed to load post."); setIsComponentLoading(false); }
      }).catch(() => { setError("Failed to load post."); setIsComponentLoading(false); });
    }
  }, [id, notes, currentUser, isUserLoading, editor, editorReady, getNotes]); // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteTitle || noteTitle.length < 3) { setError("Title must be at least 3 characters."); return; }
    const content = editor?.getHTML() || "";
    if (!content || content === "<p></p>" || editor?.getText().trim().length < 5) { setError("Content must be at least 5 characters."); return; }
    if (!categoryId) { setError("Please select a category."); return; }
    setIsSubmitting(true);
    setError("");
    try {
      await editNote(
        id,
        noteTitle,
        content,
        noteTag,
        categoryId,
        (currentUser?.role === "admin" || currentUser?.role === "SuperAdmin") ? noteIsFeatured : undefined,
        noteIsActive
      );
      navigate("/my-notes");
    } catch (err) {
      setError(err.message || "Failed to update post.");
    } finally { setIsSubmitting(false); }
  };

  if (isUserLoading || isComponentLoading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <LoadingSpinner size="lg" />
    </div>
  );

  if (error && !noteTitle) return (
    <div style={{ maxWidth: 540, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--text2)", fontStyle: "italic", marginBottom: "1.5rem" }}>{error}</p>
      <Link to="/my-notes" className="btn-primary">← Back to notes</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", margin: 0, letterSpacing: "-0.01em" }}>
          Edit post
        </h1>
      </div>

      {error && noteTitle && (
        <div style={{ padding: "0.875rem 1rem", background: "rgba(181,112,79,0.1)", borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius) var(--radius) 0", fontSize: "0.875rem", color: "var(--accent)", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Title */}
        <div>
          <label className="field-label" htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            style={{ ...inputStyle, fontSize: "1.375rem", fontFamily: "var(--font-serif)", letterSpacing: "-0.01em" }}
            required
            minLength="3"
            disabled={isSubmitting}
            onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
          />
        </div>

        {/* Editor */}
        <div>
          <label className="field-label" style={{ marginBottom: "0.75rem" }}>Content *</label>
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>

        {/* Category + Tag */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label className="field-label" htmlFor="category">Category *</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={isSubmitting || categoriesLoading}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
            >
              <option value="" disabled>{categoriesLoading ? "Loading…" : "Select…"}</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="tag">Tag <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: "0.75rem", color: "var(--text3)" }}>(optional)</span></label>
            <input
              type="text"
              id="tag"
              value={noteTag}
              onChange={(e) => setNoteTag(e.target.value)}
              style={inputStyle}
              placeholder="e.g. React, Deep Work"
              disabled={isSubmitting}
              onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
            />
          </div>
        </div>

        {/* Admin featured */}
        {(currentUser?.role === "admin" || currentUser?.role === "SuperAdmin") && (
          <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", fontSize: "0.875rem", color: "var(--text2)" }}>
            <input
              type="checkbox"
              checked={noteIsFeatured}
              onChange={(e) => setNoteIsFeatured(e.target.checked)}
              disabled={isSubmitting}
              style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
            />
            Mark as featured
          </label>
        )}

        <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", fontSize: "0.875rem", color: "var(--text2)" }}>
          <input
            type="checkbox"
            checked={noteIsActive}
            onChange={(e) => setNoteIsActive(e.target.checked)}
            disabled={isSubmitting}
            style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
          />
          Active (visible on the site)
        </label>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || !editor}
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
