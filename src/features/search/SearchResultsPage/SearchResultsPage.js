import React, { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import NoteContext from "../../../context/Notes/NoteContext";
import NotesGrid from "../../blog/NotesGrid/NotesGrid";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { searchResults, isSearching, searchError, fetchSearchResults } = useContext(NoteContext);

  useEffect(() => {
    if (query) fetchSearchResults(query);
  }, [query, fetchSearchResults]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(1.25rem, 4vw, 2.5rem) 1.25rem 4rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", margin: 0, letterSpacing: "-0.01em" }}>
          {query ? <>Results for <em style={{ color: "var(--accent)", fontStyle: "italic" }}>"{query}"</em></> : "Search"}
        </h1>
        {!isSearching && searchResults.length > 0 && (
          <p style={{ fontSize: "0.875rem", color: "var(--text3)", marginTop: "0.375rem", marginBottom: 0 }}>
            {searchResults.length} post{searchResults.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Loading */}
      {isSearching && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "1.25rem" }}>
          {Array(6).fill(null).map((_, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.375rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div className="shimmer" style={{ width: "18%", height: 10, borderRadius: 2 }} />
              <div className="shimmer" style={{ width: "88%", height: 20, borderRadius: 2 }} />
              <div className="shimmer" style={{ width: "60%", height: 14, borderRadius: 2 }} />
              <div className="shimmer" style={{ width: "40%", height: 10, borderRadius: 2, marginTop: 4 }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {searchError && !isSearching && (
        <p style={{ fontSize: "0.9375rem", color: "var(--accent)", padding: "2rem 0" }}>
          {searchError}
        </p>
      )}

      {/* Empty state */}
      {!isSearching && !searchError && query && searchResults.length === 0 && (
        <div style={{ padding: "4rem 0", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", fontWeight: 400, color: "var(--text2)", fontStyle: "italic", margin: "0 0 0.5rem" }}>
            Nothing found for "{query}".
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text3)", margin: 0 }}>
            Try different keywords or browse all topics.
          </p>
        </div>
      )}

      {/* Results */}
      {!isSearching && searchResults.length > 0 && (
        <NotesGrid
          notes={searchResults}
          isFetching={false}
          hasMore={false}
          initialLoadDone={true}
          fetchNextBatchOfNotes={() => {}}
        />
      )}
    </div>
  );
};

export default SearchResultsPage;
