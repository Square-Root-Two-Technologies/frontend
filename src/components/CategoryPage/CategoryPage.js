import React, { useContext, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
// import NoteContext from "../../context/Notes/NoteContext"; // *** REMOVED (likely) ***
import CategoryContext from "../../context/category/CategoryContext"; // *** NEW ***
import NotesGrid from "../NotesGrid/NotesGrid";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EmptyState from "../EmptySpace/EmptySpace";
import BlogCard from "../BlogCard/BlogCard"; // Keep for rendering notes

const CategoryPage = () => {
  const { categoryId } = useParams();
  // Use CategoryContext now
  const context = useContext(CategoryContext);
  const {
    categoryNotes, // Notes specific to this category page
    isFetchingCategoryNotes, // Loading state for this page's notes
    hasMoreCategoryNotes, // Pagination state for this page
    categoryError, // Error state for this page
    currentCategoryDetails, // Details of the current category
    getCategoryDetailsById, // Function to fetch category details
    fetchCategoryNotesBatch, // Function to fetch notes for this category
  } = context;

  // Use refs for stable function references in effects
  const getCategoryDetailsByIdRef = useRef(getCategoryDetailsById);
  const fetchCategoryNotesBatchRef = useRef(fetchCategoryNotesBatch);

  useEffect(() => {
    getCategoryDetailsByIdRef.current = getCategoryDetailsById;
    fetchCategoryNotesBatchRef.current = fetchCategoryNotesBatch;
  }, [getCategoryDetailsById, fetchCategoryNotesBatch]);

  // Effect to fetch details and initial notes when categoryId changes
  useEffect(() => {
    if (categoryId) {
      console.log(
        `CategoryPage Effect (categoryId changed): ID=${categoryId}. Fetching details & initial notes.`,
      );
      // Fetch details using function from CategoryContext
      getCategoryDetailsByIdRef.current(categoryId);
      // Fetch initial batch using function from CategoryContext
      fetchCategoryNotesBatchRef.current(categoryId, true); // true for reset
      window.scrollTo(0, 0);
    }
    // Cleanup function could reset state if needed when navigating away,
    // but fetchCategoryNotesBatch(id, true) handles reset on new category ID.
  }, [categoryId]); // Depend only on categoryId

  // Callback to fetch the next batch for infinite scroll
  const fetchNextCategoryBatch = useCallback(() => {
    if (
      categoryId &&
      hasMoreCategoryNotes && // Use state from CategoryContext
      !isFetchingCategoryNotes // Use state from CategoryContext
    ) {
      console.log(
        "CategoryPage: Triggering fetchNextCategoryBatch (Load More)",
      );
      // Use fetch function from CategoryContext
      fetchCategoryNotesBatchRef.current(categoryId, false); // false for append
    }
  }, [
    categoryId,
    hasMoreCategoryNotes,
    isFetchingCategoryNotes,
    // Removed context functions from deps as Ref is used
  ]);

  // Determine UI states based on CategoryContext values
  const showInitialLoading =
    isFetchingCategoryNotes && categoryNotes.length === 0;
  const showMoreLoadingIndicatorInGrid =
    isFetchingCategoryNotes && categoryNotes.length > 0;
  const showError = categoryError && !isFetchingCategoryNotes;
  const showEmpty =
    !isFetchingCategoryNotes &&
    !categoryError &&
    categoryNotes.length === 0 &&
    !showInitialLoading; // Ensure empty state doesn't show during initial load

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
        {/* Show details if available */}
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
        ) : // Show skeleton loader while fetching details (and notes)
        isFetchingCategoryNotes && !categoryError && !showEmpty ? (
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto md:mx-0"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto md:mx-0"></div>
          </div>
        ) : null}
      </div>

      {/* Notes Grid or State Indicators */}
      {showInitialLoading ? (
        // Skeleton loading for initial notes
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {Array(6)
            .fill()
            .map((_, i) => (
              <BlogCard key={`cat-skel-init-${i}`} isLoading={true} />
            ))}
        </div>
      ) : showError ? (
        // Error display
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">
            Error Loading Posts
          </h2>
          <p className="text-error mb-6">{categoryError}</p>{" "}
          {/* Use error from CategoryContext */}
          <button
            onClick={() => fetchCategoryNotesBatchRef.current(categoryId, true)} // Retry with reset
            className="btn-primary mr-2"
            disabled={isFetchingCategoryNotes} // Disable while fetching
          >
            Retry
          </button>
          <Link to="/categories" className="btn-secondary">
            Back to Categories
          </Link>
        </div>
      ) : showEmpty ? (
        // Empty state
        <EmptyState
          message={`No blog posts found in the "${
            currentCategoryDetails?.name || "selected"
          }" category yet.`}
        />
      ) : (
        // Render the NotesGrid with category-specific notes
        <NotesGrid
          notes={categoryNotes} // Use notes from CategoryContext
          isFetching={showMoreLoadingIndicatorInGrid} // Pass loading state for pagination
          hasMore={hasMoreCategoryNotes} // Pass pagination state
          initialLoadDone={true} // Assume initial load happened if we reach here
          fetchNextBatchOfNotes={fetchNextCategoryBatch} // Pass the fetch callback
        />
      )}
    </div>
  );
};

export default CategoryPage;
