// src/components/FeaturedPosts/FeaturedPosts.js
import React, { useContext, useRef, useCallback } from "react";
import NoteContext from "../../context/notes/NoteContext";
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

  const lastFeaturedNoteRef = useCallback(
    (node) => {
      if (
        isInitialFeaturedLoading ||
        isFetchingMoreFeatured ||
        !hasMoreFeatured
      ) {
        return;
      }

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreFeatured) {
            console.log("Fetching next featured batch...");
            fetchFeaturedNotesBatch();
          }
        },
        {
          root: null,
          threshold: 0.8, // Trigger when 80% of the last card is visible
        },
      );

      if (node) observer.current.observe(node);
    },
    [
      isInitialFeaturedLoading,
      isFetchingMoreFeatured,
      hasMoreFeatured,
      fetchFeaturedNotesBatch,
    ],
  );

  return (
    <section className="mb-10">
      <h2 className="text-heading mb-6">Featured Posts</h2>
      <div className="flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        {isInitialFeaturedLoading &&
          Array(3)
            .fill()
            .map((_, i) => (
              <div
                key={`feat-skel-init-${i}`}
                className="w-72 flex-shrink-0 snap-start"
              >
                <BlogCard isLoading={true} />
              </div>
            ))}

        {!isInitialFeaturedLoading &&
          featuredNotes.map((note, index) => (
            <div
              ref={
                index === featuredNotes.length - 1 ? lastFeaturedNoteRef : null
              }
              key={note._id}
              className="w-72 flex-shrink-0 snap-start"
            >
              <BlogCard note={note} isFeatured={true} />
            </div>
          ))}

        {!isInitialFeaturedLoading && isFetchingMoreFeatured && (
          <div className="w-72 flex-shrink-0 snap-start flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        )}

        {!isInitialFeaturedLoading &&
          !isFetchingMoreFeatured &&
          featuredNotes.length === 0 && (
            <div className="text-center py-4 text-subtle w-full">
              No featured posts available.
            </div>
          )}

        {!isInitialFeaturedLoading &&
          !hasMoreFeatured &&
          featuredNotes.length > 0 &&
          !isFetchingMoreFeatured && (
            <div className="w-72 flex-shrink-0 snap-start flex items-center justify-center text-subtle text-sm italic">
              End of featured posts.
            </div>
          )}
      </div>
    </section>
  );
};

export default FeaturedPosts;
