import React from "react";
import BlogCard from "../BlogCard/BlogCard";

const NotesGrid = ({ notes, isFetching, hasMore, initialLoadDone, fetchNextBatchOfNotes }) => {
  return (
    <div>
      {/* Section label */}
      {initialLoadDone && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)" }}>
            All posts
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          {notes.length > 0 && (
            <span style={{ fontSize: "0.6875rem", color: "var(--text3)", letterSpacing: "0.04em", flexShrink: 0 }}>
              {notes.length}{hasMore ? "+" : ""} posts
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2rem",
      }}>
        {/* Initial skeleton */}
        {isFetching && !initialLoadDone
          ? Array(6).fill(null).map((_, i) => <BlogCard key={`sk-${i}`} isLoading />)
          : notes.map((note) => (
              <BlogCard key={note._id} note={note} />
            ))
        }
        {/* Append skeleton while loading more */}
        {isFetching && initialLoadDone && hasMore &&
          Array(3).fill(null).map((_, i) => <BlogCard key={`more-${i}`} isLoading />)
        }
      </div>

      {/* Empty state */}
      {!isFetching && notes.length === 0 && initialLoadDone && (
        <div style={{ padding: "3rem 0", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 400, color: "var(--text2)", fontStyle: "italic", margin: "0 0 0.5rem" }}>
            No posts here yet.
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text3)", margin: 0 }}>
            Try a different filter, or check back soon.
          </p>
        </div>
      )}

      {/* Load more */}
      {hasMore && initialLoadDone && (
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "2rem" }}>
          <button
            onClick={fetchNextBatchOfNotes}
            disabled={isFetching}
            style={{
              padding: "0.75rem 2.5rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: isFetching ? "var(--text3)" : "var(--text2)",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              cursor: isFetching ? "default" : "pointer",
              letterSpacing: "0.02em",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { if (!isFetching) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; }}
          >
            {isFetching ? "Loading…" : "Load more posts"}
          </button>
        </div>
      )}

      {/* End of feed */}
      {!hasMore && initialLoadDone && notes.length > 0 && !isFetching && (
        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--text3)", fontStyle: "italic", padding: "0.5rem 0 2.5rem" }}>
          You've read everything.
        </p>
      )}
    </div>
  );
};

export default NotesGrid;
