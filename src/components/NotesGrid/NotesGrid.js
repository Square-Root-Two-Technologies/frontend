import React, { useCallback, useRef } from "react";
import BlogCard from "../BlogCard/BlogCard";
import EmptyState from "../EmptySpace/EmptySpace";
import LoadingMoreBlogs from "../LoadingMoreBlogs/LoadingMoreBlogs"; // Optional: Use a specific loading card

const NotesGrid = ({
  notes,
  isFetching, // This now specifically means "is fetching MORE"
  hasMore,
  initialLoadDone, // Use this to differentiate initial load vs subsequent loads
  fetchNextBatchOfNotes,
}) => {
  const observer = useRef();
  const lastNoteElementRef = useCallback(
    (node) => {
      // Only trigger if not currently fetching more and more items exist
      if (isFetching || !hasMore) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            console.log(
              "NotesGrid Intersection Observer: Fetching next batch...",
            );
            fetchNextBatchOfNotes();
          }
        },
        { threshold: 0.8 }, // Adjust threshold as needed
      );
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore, fetchNextBatchOfNotes],
  );

  // Decide whether to show loading indicators *within* the grid
  const showLoadingIndicator = isFetching && initialLoadDone && hasMore;
  // Decide whether to show the "end" message
  const showEndMessage =
    !hasMore && initialLoadDone && notes.length > 0 && !isFetching;
  // Decide whether to show the empty state (only after initial load is done)
  const showEmptyState = !isFetching && notes.length === 0 && initialLoadDone;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {/* Render existing notes */}
      {notes.map((note, index) => (
        <BlogCard
          // Assign ref to the last element for intersection observer
          ref={notes.length === index + 1 ? lastNoteElementRef : null}
          key={note._id || `note-${index}`} // Add fallback key just in case
          note={note}
          isLoading={false} // Notes passed here are assumed loaded
        />
      ))}

      {/* Show loading placeholders ONLY when fetching MORE */}
      {showLoadingIndicator && (
        <>
          {/* You can show skeleton cards or a simpler indicator */}
          {Array(3)
            .fill()
            .map((_, i) => (
              // <BlogCard key={`grid-skel-more-${i}`} isLoading={true} />
              // Or use a dedicated simpler loader card:
              <LoadingMoreBlogs key={`grid-loading-more-${i}`} />
            ))}
        </>
      )}

      {/* Show Empty State ONLY if applicable after initial load */}
      {showEmptyState && (
        <div className="col-span-full">
          {" "}
          {/* Make empty state span full width */}
          <EmptyState message="No posts found in this category." />
        </div>
      )}

      {/* Show "End of results" message */}
      {showEndMessage && (
        <div className="text-center col-span-full py-6 text-subtle">
          You've reached the end! 👋
        </div>
      )}
    </div>
  );
};

export default NotesGrid;
