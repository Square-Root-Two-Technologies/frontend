import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EmptyState from "../EmptySpace/EmptySpace";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const stripHtml = (html) =>
  html ? html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";

const NoteCard = ({ note, onDelete, onEdit, isAdminView }) => {
  const { title, description, date, _id, tag, type, user } = note;
  const label = type || tag;
  const excerpt = stripHtml(description);
  const preview = excerpt.length > 100 ? excerpt.slice(0, 100) + "…" : excerpt;

  return (
    <div
      style={{
        padding: "1.25rem",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {isAdminView && user?.name && (
        <p style={{ fontSize: "0.75rem", color: "var(--text3)", margin: 0, fontStyle: "italic" }}>
          by <span style={{ color: "var(--text2)", fontStyle: "normal" }}>{user.name}</span>
        </p>
      )}
      {label && (
        <span style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--accent)" }}>
          {label}
        </span>
      )}
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", fontWeight: 400, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.8125rem", color: "var(--text3)", margin: 0 }}>{formatDate(date)}</p>
      {preview && (
        <p style={{ fontSize: "0.875rem", color: "var(--text2)", lineHeight: 1.6, margin: 0, flexGrow: 1 }}>{preview}</p>
      )}
      <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
        <button
          onClick={() => onEdit(_id)}
          className="btn-secondary"
          style={{ padding: "0.375rem 0.875rem", fontSize: "0.8125rem" }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(_id)}
          style={{ padding: "0.375rem 0.875rem", fontSize: "0.8125rem", fontFamily: "var(--font-sans)", color: "var(--accent)", background: "transparent", border: "1px solid var(--accent)", borderRadius: "var(--radius)", cursor: "pointer", opacity: 0.8, transition: "opacity var(--transition)" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const MyNotesPage = () => {
  const { notes, getNotes, deleteNote, isLoading: isNotesLoading } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoading && currentUser) getNotes().catch(console.error);
  }, [currentUser, isUserLoading, getNotes]);

  const isAdminView = currentUser?.role === "admin";
  const isLoading = isUserLoading || isNotesLoading;

  const handleDelete = (id) => {
    if (window.confirm("Delete this post? This can't be undone.")) {
      deleteNote(id).catch(console.error);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", margin: "0 0 0.25rem", letterSpacing: "-0.01em" }}>
            {isAdminView ? "All notes" : "My notes"}
          </h1>
          {!isLoading && (
            <p style={{ fontSize: "0.875rem", color: "var(--text3)", margin: 0 }}>
              {notes.length} post{notes.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <button className="btn-primary" onClick={() => navigate("/add-note")}>
          + New post
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : notes.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={handleDelete}
              onEdit={(id) => navigate(`/edit-note/${id}`)}
              isAdminView={isAdminView}
            />
          ))}
        </div>
      ) : (
        <EmptyState message={isAdminView ? "No notes from any user yet." : "You haven't written anything yet."} />
      )}
    </div>
  );
};

export default MyNotesPage;
