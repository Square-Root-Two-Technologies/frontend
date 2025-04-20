// FILE: src/components/CategoryPage/CategoryPage.js

import React, {
  useContext,
  useEffect,
  useCallback,
  useRef, // Import useRef
} from "react";
import { useParams, Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import NotesGrid from "../NotesGrid/NotesGrid";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EmptyState from "../EmptySpace/EmptySpace";
import BlogCard from "../BlogCard/BlogCard"; // Keep BlogCard import

const CategoryPage = () => {
  const { categoryId } = useParams();
  // Get the whole context object to access functions and state
  const context = useContext(NoteContext);

  // Refs to hold the latest function instances from context
  const getCategoryDetailsByIdRef = useRef(context.getCategoryDetailsById);
  const fetchCategoryNotesBatchRef = useRef(context.fetchCategoryNotesBatch);

  // Effect to update the refs whenever the context functions change identity
  useEffect(() => {
    getCategoryDetailsByIdRef.current = context.getCategoryDetailsById;
    fetchCategoryNotesBatchRef.current = context.fetchCategoryNotesBatch;
  }, [context.getCategoryDetailsById, context.fetchCategoryNotesBatch]);

  // *** Main Effect: Trigger initial load ONLY when categoryId changes ***
  useEffect(() => {
    if (categoryId) {
      console.log(
        `CategoryPage Effect (categoryId changed): ID=${categoryId}. Fetching details & initial notes.`,
      );

      // Call latest functions via refs
      getCategoryDetailsByIdRef.current(categoryId);
      fetchCategoryNotesBatchRef.current(categoryId, true); // reset = true

      window.scrollTo(0, 0);
    }
    // NO cleanup needed here unless you want to cancel fetches on unmount/fast change
  }, [categoryId]); // <<<--- ONLY depends on categoryId from URL

  // Callback for NotesGrid infinite scroll
  const fetchNextCategoryBatch = useCallback(() => {
    // Read current state directly from context for checks
    if (
      categoryId &&
      context.hasMoreCategoryNotes &&
      !context.isFetchingCategoryNotes
    ) {
      console.log(
        "CategoryPage: Triggering fetchNextCategoryBatch (Load More)",
      );
      // Call latest function via ref, ensuring reset is false
      fetchCategoryNotesBatchRef.current(categoryId, false);
    }
    // Dependencies only include things needed for the check *logic* or the categoryId itself
    // It does NOT depend on fetchCategoryNotesBatchRef directly.
  }, [
    categoryId,
    context.hasMoreCategoryNotes,
    context.isFetchingCategoryNotes,
    // No need for fetchCategoryNotesBatchRef here as a dependency
  ]);

  // --- Rendering Logic ---
  // Read state directly from context for rendering
  const {
    categoryNotes,
    isFetchingCategoryNotes,
    hasMoreCategoryNotes,
    categoryError,
    currentCategoryDetails,
  } = context;

  // Derive UI states from context state
  const showInitialLoading =
    isFetchingCategoryNotes && categoryNotes.length === 0;
  const showMoreLoadingIndicatorInGrid =
    isFetchingCategoryNotes && categoryNotes.length > 0;
  const showError = categoryError && !isFetchingCategoryNotes;
  // Show empty only after the first fetch attempt is complete and resulted in zero notes without error.
  const showEmpty =
    !isFetchingCategoryNotes &&
    !categoryError &&
    categoryNotes.length === 0 &&
    !showInitialLoading; // Added !showInitialLoading check

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-160px)]">
      {/* Back Link */}
      <Link
        to="/categories"
        className="text-primary hover:underline mb-6 inline-block text-sm"
      >
        ← Back to Categories
      </Link>

      {/* Category Header */}
      <div className="mb-8 text-center md:text-left">
        {/* Use currentCategoryDetails for title/desc */}
        {currentCategoryDetails ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
              {currentCategoryDetails.name}
            </h1>
            {currentCategoryDetails.description && (
              <p className="text-md text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
                {currentCategoryDetails.description}
              </p>
            )}
          </>
        ) : // Show loading placeholder *only* if details aren't loaded yet and we are fetching (and no error)
        isFetchingCategoryNotes && !categoryError && !showEmpty ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : null}
      </div>

      {/* Content Area: Decide what to show based on derived UI states */}
      {showInitialLoading ? (
        // Skeleton Loader during initial fetch
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {Array(6)
            .fill()
            .map((_, i) => (
              <BlogCard key={`cat-skel-init-${i}`} isLoading={true} />
            ))}
        </div>
      ) : showError ? (
        // Error Message
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">
            Error Loading Posts
          </h2>
          <p className="text-error mb-6">{categoryError}</p>
          {/* Use ref to call retry */}
          <button
            onClick={() => fetchCategoryNotesBatchRef.current(categoryId, true)}
            className="btn-primary mr-2"
            disabled={isFetchingCategoryNotes}
          >
            Retry
          </button>
          <Link to="/categories" className="btn-secondary">
            Back to Categories
          </Link>
        </div>
      ) : showEmpty ? (
        // Empty State Message
        <EmptyState
          message={`No blog posts found in the "${
            currentCategoryDetails?.name || "selected"
          }" category yet.`}
        />
      ) : (
        // Notes Grid (Handles subsequent loading indicator internally via isFetching prop)
        <NotesGrid
          notes={categoryNotes}
          isFetching={showMoreLoadingIndicatorInGrid} // Let NotesGrid show "loading more" indicator
          hasMore={hasMoreCategoryNotes}
          initialLoadDone={true} // If grid renders, initial load is considered done
          fetchNextBatchOfNotes={fetchNextCategoryBatch} // Pass the stable callback for scroll loading
        />
      )}
    </div>
  );
};

export default CategoryPage;
