import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import BlogCard from "../BlogCard/BlogCard";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";

/* Minimal breadcrumb: Topics › [parent?] › Category Name */
const Breadcrumb = ({ category }) => {
  if (!category) return null;
  return (
    <nav style={{ fontSize: "0.8125rem", color: "var(--text3)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap" }}>
      <Link to="/home" style={{ color: "var(--text3)", textDecoration: "none" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}>
        Read
      </Link>
      <span style={{ opacity: 0.4 }}>›</span>
      <Link to="/categories" style={{ color: "var(--text3)", textDecoration: "none" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}>
        Topics
      </Link>
      {category.parent && (
        <>
          <span style={{ opacity: 0.4 }}>›</span>
          <Link to={`/category/${category.parent._id}`} style={{ color: "var(--text3)", textDecoration: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}>
            {category.parent.name}
          </Link>
        </>
      )}
      <span style={{ opacity: 0.4 }}>›</span>
      <span style={{ color: "var(--text2)" }}>{category.name}</span>
    </nav>
  );
};

const CategoryPage = () => {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [catError, setCatError] = useState(null);

  const [notes, setNotes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [initialDone, setInitialDone] = useState(false);
  const [notesError, setNotesError] = useState(null);

  /* Intersection observer sentinel ref */
  const observer = useRef();
  const sentinelRef = useCallback(
    (node) => {
      if (isFetching || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting && hasMore) fetchNext(); },
        { threshold: 0.5 },
      );
      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFetching, hasMore],
  );

  /* Fetch category metadata */
  useEffect(() => {
    if (!id) return;
    setCategory(null);
    setCatError(null);
    fetch(`${host}/api/categories/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCategory(data.category);
        else setCatError(data.error || "Category not found.");
      })
      .catch(() => setCatError("Network error loading category."));
  }, [id]);

  /* Reset notes when category changes */
  useEffect(() => {
    setNotes([]);
    setLastId(null);
    setHasMore(true);
    setInitialDone(false);
    setNotesError(null);
  }, [id]);

  const fetchNext = useCallback(async () => {
    if (isFetching || !hasMore || !id) return;
    setIsFetching(true);
    setNotesError(null);
    try {
      const url = `${host}/api/notes/by-category/${id}?limit=9${lastId ? `&lastId=${lastId}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load posts.");
      setNotes((prev) => {
        const seen = new Set(prev.map((n) => n._id));
        return [...prev, ...data.notes.filter((n) => !seen.has(n._id))];
      });
      setLastId(data.nextLastId || null);
      setHasMore(data.hasMore || false);
    } catch (err) {
      setNotesError(err.message);
      setHasMore(false);
    } finally {
      setIsFetching(false);
      setInitialDone(true);
    }
  }, [id, isFetching, hasMore, lastId]);

  /* Kick off initial load once reset is complete */
  useEffect(() => {
    if (!initialDone && !isFetching && hasMore && id) {
      fetchNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initialDone]);

  const isLoading = !initialDone && isFetching;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <Breadcrumb category={category} />
        {catError ? (
          <p style={{ color: "var(--accent)", fontSize: "0.9375rem" }}>{catError}</p>
        ) : category ? (
          <>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", margin: 0, letterSpacing: "-0.01em" }}>
              {category.name}
            </h1>
            {category.description && (
              <p style={{ fontSize: "0.9375rem", color: "var(--text2)", marginTop: "0.5rem", marginBottom: 0, lineHeight: 1.7 }}>
                {category.description}
              </p>
            )}
          </>
        ) : (
          <div style={{ height: 32, width: 200, background: "var(--bg3)", borderRadius: 2 }} />
        )}
      </div>

      {/* Notes grid */}
      {notesError && (
        <p style={{ color: "var(--accent)", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>{notesError}</p>
      )}

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: "1.25rem" }}>
          {Array(6).fill(null).map((_, i) => <BlogCard key={i} isLoading />)}
        </div>
      ) : notes.length === 0 && initialDone ? (
        <p style={{ color: "var(--text3)", fontStyle: "italic", fontSize: "0.9375rem", padding: "2rem 0" }}>
          No posts in this topic yet.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: "1.25rem" }}>
          {notes.map((note, i) => (
            <BlogCard
              key={note._id}
              note={note}
              ref={i === notes.length - 1 ? sentinelRef : null}
            />
          ))}
          {isFetching && initialDone && Array(3).fill(null).map((_, i) => <BlogCard key={`sk-${i}`} isLoading />)}
        </div>
      )}

      {!hasMore && notes.length > 0 && initialDone && !isFetching && (
        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--text3)", fontStyle: "italic", padding: "2rem 0" }}>
          You've reached the end.
        </p>
      )}

      {/* Invisible sentinel for infinite scroll */}
      {hasMore && initialDone && !isFetching && (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}

      {isFetching && !initialDone && (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
