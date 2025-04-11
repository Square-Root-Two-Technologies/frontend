import React, { useCallback, useRef } from "react";
import BlogCard from "../BlogCard/BlogCard";
import EmptyState from "../EmptySpace/EmptySpace";

const NotesGrid = ({
  notes,
  isFetching,
  hasMore,
  initialLoadDone,
  fetchNextBatchOfNotes,
}) => {
  const observer = useRef();

  const lastNoteElementRef = useCallback(
    (node) => {
      if (isFetching || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchNextBatchOfNotes();
          }
        },
        { threshold: 0.5 },
      );
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore, fetchNextBatchOfNotes],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {isFetching && !initialLoadDone ? (
        <>
          {Array(6)
            .fill()
            .map((_, i) => (
              <BlogCard key={`grid-skel-init-${i}`} isLoading={true} />
            ))}
        </>
      ) : (
        <>
          {notes.map((note, index) => (
            <BlogCard
              ref={notes.length === index + 1 ? lastNoteElementRef : null}
              key={note._id}
              note={note}
            />
          ))}
          {isFetching &&
            initialLoadDone &&
            hasMore &&
            Array(3)
              .fill()
              .map((_, i) => (
                <BlogCard key={`grid-skel-more-${i}`} isLoading={true} />
              ))}
        </>
      )}

      {!isFetching && notes.length === 0 && initialLoadDone && (
        <EmptyState message="No posts found." />
      )}
      {!hasMore && initialLoadDone && notes.length > 0 && !isFetching && (
        <div className="text-center col-span-full py-6 text-subtle">
          You've reached the end! 👋
        </div>
      )}
    </div>
  );
};

export default NotesGrid;
