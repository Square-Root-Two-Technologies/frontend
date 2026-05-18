import React, { useContext, useRef, useCallback } from "react";
import NoteContext from "../../../context/Notes/NoteContext";
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
        (entries) => { if (entries[0].isIntersecting) fetchFeaturedNotesBatch(); },
        { threshold: 0.8 },
      );
      if (node) observer.current.observe(node);
    },
    [isInitialFeaturedLoading, isFetchingMoreFeatured, hasMoreFeatured, fetchFeaturedNotesBatch],
  );

  if (!isInitialFeaturedLoading && featuredNotes.length === 0) return null;

  const [hero, ...rest] = featuredNotes;
  const secondary = rest.slice(0, 2);

  return (
    <section style={{ marginBottom: "3rem" }}>
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)" }}>
          Featured
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      {/* Hero — full-width first featured post */}
      {isInitialFeaturedLoading ? (
        <BlogCard isLoading hero />
      ) : hero ? (
        <BlogCard
          note={hero}
          hero
          ref={featuredNotes.length === 1 ? lastRef : null}
        />
      ) : null}

      {/* Secondary row — up to 2 more featured posts */}
      {(secondary.length > 0 || (isInitialFeaturedLoading)) && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.25rem",
          marginTop: "1.25rem",
        }}>
          {isInitialFeaturedLoading
            ? Array(2).fill(null).map((_, i) => <BlogCard key={i} isLoading />)
            : secondary.map((note, i) => (
                <BlogCard
                  key={note._id}
                  note={note}
                  ref={i === secondary.length - 1 && !hasMoreFeatured ? lastRef : null}
                />
              ))
          }
          {isFetchingMoreFeatured && <BlogCard isLoading />}
        </div>
      )}
    </section>
  );
};

export default FeaturedPosts;
