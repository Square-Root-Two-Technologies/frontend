import React, { useCallback, useRef } from "react";
import BlogCard from "../BlogCard/BlogCard";
import EmptyState from "../../../components/EmptySpace/EmptySpace";

const NotesGrid = ({ notes, isFetching, hasMore, initialLoadDone, fetchNextBatchOfNotes }) => {
  const observer = useRef();

  const lastNoteRef = useCallback(
    (node) => {
      if (isFetching || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting && hasMore) fetchNextBatchOfNotes(); },
        { threshold: 0.5 },
      );
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore, fetchNextBatchOfNotes],
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
        {isFetching && !initialLoadDone
          ? Array(6).fill(null).map((_, i) => <BlogCard key={`skel-${i}`} isLoading />)
          : notes.map((note, i) => (
              <BlogCard
                key={note._id}
                ref={i === notes.length - 1 ? lastNoteRef : null}
                note={note}
              />
            ))
        }
        {isFetching && initialLoadDone && hasMore && Array(3).fill(null).map((_, i) => <BlogCard key={`more-${i}`} isLoading />)}
        {!isFetching && notes.length === 0 && initialLoadDone && (
          <EmptyState message="No posts match this filter." />
        )}
      </div>

      {!hasMore && initialLoadDone && notes.length > 0 && !isFetching && (
        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--text3)", fontStyle: "italic", padding: "1.5rem 0" }}>
          You've reached the end.
        </p>
      )}
    </div>
  );
};

export default NotesGrid;
