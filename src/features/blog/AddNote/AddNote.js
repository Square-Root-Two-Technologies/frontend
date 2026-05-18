import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoteContext from "../../../context/Notes/NoteContext";
import UserContext from "../../../context/user/UserContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
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

const AddNote = () => {
  const navigate = useNavigate();
  const { addNote } = useContext(NoteContext);
  const { currentUser } = useContext(UserContext);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteTag, setNoteTag] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [noteIsFeatured, setNoteIsFeatured] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";

  useEffect(() => {
    fetch(`${host}/api/categories`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.categories || []);
        setCategories(list);
        setCategoriesLoading(false);
      })
      .catch(() => setCategoriesLoading(false));
  }, [host]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
    ],
    content: "",
    onUpdate: ({ editor }) => setEditorContent(editor.getHTML()),
    editorProps: {
      attributes: {
        style: "min-height:400px;padding:1rem 1.25rem;outline:none;font-family:var(--font-sans);font-size:1.0625rem;line-height:1.8;color:var(--text);background:var(--bg2);border:1px solid var(--border);border-top:none;border-radius:0 0 var(--radius) var(--radius);",
      },
    },
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!noteTitle || noteTitle.length < 3) { setError("Title must be at least 3 characters."); return; }
    if (!editorContent || editorContent === "<p></p>" || editor?.getText().trim().length < 5) { setError("Content must be at least 5 characters."); return; }
    if (!categoryId) { setError("Please select a category."); return; }

    setIsLoading(true);
    try {
      const noteToAdd = { title: noteTitle, description: editorContent, tag: noteTag || "General", categoryId };
      if (currentUser?.role === "admin" || currentUser?.role === "SuperAdmin") noteToAdd.isFeatured = noteIsFeatured;
      const response = await addNote(noteToAdd);
      if (response.success) navigate("/my-notes");
      else setError(response.message || "Failed to add note.");
    } catch { setError("An unexpected error occurred."); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", margin: 0, letterSpacing: "-0.01em" }}>
          New post
        </h1>
      </div>

      {error && (
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
            placeholder="Give your post a title…"
            required
            minLength="3"
            disabled={isLoading}
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

        {/* Category + Tag row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label className="field-label" htmlFor="category">Category *</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={isLoading || categoriesLoading}
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
              disabled={isLoading}
              onFocus={(e) => e.target.style.borderBottomColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderBottomColor = "var(--border)"}
            />
          </div>
        </div>

        {/* Admin: featured */}
        {(currentUser?.role === "admin" || currentUser?.role === "SuperAdmin") && (
          <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", fontSize: "0.875rem", color: "var(--text2)" }}>
            <input
              type="checkbox"
              checked={noteIsFeatured}
              onChange={(e) => setNoteIsFeatured(e.target.checked)}
              disabled={isLoading}
              style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
            />
            Mark as featured
          </label>
        )}

        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !editor}
            style={{ padding: "0.875rem 2rem", fontSize: "0.9375rem", opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? <LoadingSpinner size="sm" inline /> : "Publish"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/my-notes")}
            disabled={isLoading}
            style={{ padding: "0.875rem 1.5rem", fontSize: "0.9375rem" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNote;
