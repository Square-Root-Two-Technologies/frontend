// src/components/SearchResultsPage/SearchResultsPage.js
import React, { useContext, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NotesGrid from "../NotesGrid/NotesGrid"; // Reusing the grid
import EmptyState from "../EmptySpace/EmptySpace"; // Reusing the empty state

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const { searchResults, isSearching, searchError, fetchSearchResults } =
    useContext(NoteContext);

  useEffect(() => {
    // Fetch results when the query parameter changes
    if (query) {
      fetchSearchResults(query);
    }
    // Optional: Clear results if query is removed? Decide based on desired UX.
    // else {
    //   fetchSearchResults(""); // Or manage state differently
    // }
    window.scrollTo(0, 0); // Scroll to top on new search
  }, [query, fetchSearchResults]);

  const renderContent = () => {
    if (isSearching) {
      return (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      );
    }

    if (searchError) {
      return (
        <div className="card text-center max-w-md mx-auto mt-10">
          <h2 className="text-xl font-semibold text-error mb-4">
            Search Error
          </h2>
          <p className="text-error mb-6">{searchError}</p>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      );
    }

    if (!isSearching && searchResults.length === 0) {
      return (
        <EmptyState
          message={`No results found for "${query}". Try a different search term.`}
        />
      );
    }

    // Use NotesGrid for consistency, passing only the results
    // Disable its internal pagination/loading logic for search results
    return (
      <NotesGrid
        notes={searchResults}
        isFetching={false} // NotesGrid's own fetching is disabled here
        hasMore={false} // No pagination for search results in this setup
        initialLoadDone={true} // Assume load is "done" for rendering purposes
        fetchNextBatchOfNotes={() => {}} // Provide empty function
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-160px)]">
      <h1 className="text-heading mb-6">
        Search Results {query ? `for "${query}"` : ""}
      </h1>
      {renderContent()}
    </div>
  );
};

export default SearchResultsPage;
