import React, { useContext, useRef, useCallback } from "react";
import NoteContext from "../../context/Notes/NoteContext";
import BlogCard from "../BlogCard/BlogCard";

const FeaturedPosts = () => {
  const {
    featuredNotes,
    fetchFeaturedNotesBatch,
    hasMoreFeatured,
    isInitialFeaturedLoading,
    isFetchingMoreFeatured,
  } = useContext(NoteContext);

  const observer = useRef();

  const lastRef = useCallback(
    (node) => {
      if (isInitialFeaturedLoading || isFetchingMoreFeatured || !hasMoreFeatured) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreFeatured) fetchFeaturedNotesBatch();
        },
        { threshold: 0.8 },
      );
      if (node) observer.current.observe(node);
    },
    [isInitialFeaturedLoading, isFetchingMoreFeatured, hasMoreFeatured, fetchFeaturedNotesBatch],
  );

  if (!isInitialFeaturedLoading && featuredNotes.length === 0) return null;

  return (
    <section style={{ marginBottom: "3rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 400, color: "var(--text)", margin: 0 }}>
          Featured
        </h2>
        <span style={{ fontSize: "0.75rem", color: "var(--text3)", letterSpacing: "0.04em" }}>
          {featuredNotes.length} post{featuredNotes.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          paddingBottom: "0.75rem",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        <style>{`.no-scroll::-webkit-scrollbar{display:none}`}</style>
        {isInitialFeaturedLoading
          ? Array(3).fill(null).map((_, i) => (
              <div key={i} style={{ width: 280, flexShrink: 0, scrollSnapAlign: "start" }}>
                <BlogCard isLoading />
              </div>
            ))
          : featuredNotes.map((note, i) => (
              <div
                key={note._id}
                ref={i === featuredNotes.length - 1 ? lastRef : null}
                style={{ width: 280, flexShrink: 0, scrollSnapAlign: "start" }}
              >
                <BlogCard note={note} isFeatured />
              </div>
            ))
        }
        {isFetchingMoreFeatured && (
          <div style={{ width: 280, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="ep-spinner" />
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPosts;
