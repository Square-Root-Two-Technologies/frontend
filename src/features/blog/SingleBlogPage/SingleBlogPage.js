import React, { useEffect, useContext, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import NoteContext from "../../../context/Notes/NoteContext";
import UserContext from "../../../context/user/UserContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

/* ── Scroll progress bar ── */
const ReadingProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100, background: "var(--border)" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", transition: "width 0.1s linear", borderRadius: "0 2px 2px 0" }} />
    </div>
  );
};

/* ── Skeleton for loading state ── */
const ArticleSkeleton = () => (
  <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.5rem" }}>
    <div style={{ width: 80, height: 10, background: "var(--bg3)", borderRadius: 2, marginBottom: "2rem" }} />
    <div style={{ width: "18%", height: 10, background: "var(--bg3)", borderRadius: 2, marginBottom: "1rem" }} />
    <div style={{ width: "88%", height: 36, background: "var(--bg3)", borderRadius: 2, marginBottom: "0.75rem" }} />
    <div style={{ width: "72%", height: 36, background: "var(--bg3)", borderRadius: 2, marginBottom: "1.5rem" }} />
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: "2.5rem" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg3)" }} />
      <div style={{ width: 120, height: 10, background: "var(--bg3)", borderRadius: 2 }} />
    </div>
    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
      {[88, 95, 78, 92, 60, 85, 70].map((w, i) => (
        <div key={i} style={{ width: `${w}%`, height: 14, background: "var(--bg3)", borderRadius: 2 }} />
      ))}
    </div>
  </div>
);

const SingleBlogPage = () => {
  const { id } = useParams();
  const { note, getNoteById, isFetchingNote, singleNoteError, allNotes } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const articleRef = useRef(null);

  useEffect(() => {
    if ((!note || note._id !== id) && !isFetchingNote) {
      getNoteById(id);
    }
  }, [id, getNoteById]); // eslint-disable-line

  /* Related posts — same category or tag, excluding current */
  const related = React.useMemo(() => {
    if (!note || !allNotes?.length) return [];
    const catId = note.category?._id || note.category;
    const tag = note.type || note.tag;
    return allNotes
      .filter((n) => {
        if (n._id === id) return false;
        if (catId && (n.category?._id === catId || n.category === catId)) return true;
        if (tag && (n.type === tag || n.tag === tag)) return true;
        return false;
      })
      .slice(0, 3);
  }, [note, allNotes, id]);

  if (isFetchingNote || isUserLoading || (!note && !singleNoteError)) {
    return (
      <>
        <ReadingProgress />
        <ArticleSkeleton />
      </>
    );
  }

  if (singleNoteError) {
    return (
      <div style={{ maxWidth: 540, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--text2)", marginBottom: "0.75rem", fontStyle: "italic", fontWeight: 400 }}>
          Couldn't load this post.
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--text3)", marginBottom: "2rem", lineHeight: 1.6 }}>{singleNoteError}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => getNoteById(id)}>Try again</button>
          <Link to="/home" className="btn-secondary">← All posts</Link>
        </div>
      </div>
    );
  }

  if (!note) return null;

  const { title, description, tag, type, readTimeMinutes, user, date, ancestorPath } = note;
  const authorName = user?.name || "Unknown";
  const label = type || tag;
  const canEdit = !isUserLoading && currentUser && user &&
    (currentUser._id === user._id || currentUser.role === "admin" || currentUser.role === "SuperAdmin");

  return (
    <>
      <ReadingProgress />

      {/* ── Outer shell: constrain to readable measure ── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* ── Breadcrumb ── */}
        <nav style={{ fontSize: "0.8125rem", color: "var(--text3)", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.25rem", marginBottom: "2rem" }}>
          <Link to="/home" style={{ color: "var(--text3)", textDecoration: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}>
            Read
          </Link>
          {ancestorPath?.map((crumb) => (
            <React.Fragment key={crumb._id}>
              <span style={{ opacity: 0.4 }}>›</span>
              <Link to={`/category/${crumb._id}`} style={{ color: "var(--text3)", textDecoration: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}>
                {crumb.name}
              </Link>
            </React.Fragment>
          ))}
          {note.category?.name && (
            <React.Fragment>
              <span style={{ opacity: 0.4 }}>›</span>
              <Link to={`/category/${note.category._id}`} style={{ color: "var(--text3)", textDecoration: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}>
                {note.category.name}
              </Link>
            </React.Fragment>
          )}
        </nav>

        {/* ── Article header ── */}
        <header style={{ marginBottom: "2.5rem" }}>
          {/* Category pill */}
          {label && (
            <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", display: "block", marginBottom: "0.875rem" }}>
              {label}
            </span>
          )}

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.875rem, 5vw, 2.75rem)",
            fontWeight: 400,
            color: "var(--text)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: "0 0 1.75rem",
          }}>
            {title}
          </h1>

          {/* Author + meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap" }}>
            {/* Avatar */}
            {user?.profilePictureUrl
              ? <img src={user.profilePictureUrl} alt={authorName} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} onError={(e) => e.target.style.display = "none"} />
              : <span style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--bg3)", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 600, color: "var(--text2)", flexShrink: 0 }}>
                  {authorName[0]?.toUpperCase()}
                </span>
            }
            <div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--text)", lineHeight: 1.3 }}>{authorName}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text3)", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.1875rem" }}>
                {date && <time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time>}
                {readTimeMinutes && (
                  <><span style={{ opacity: 0.4 }}>·</span><span>{readTimeMinutes} min read</span></>
                )}
              </div>
            </div>

            {/* Edit button — right-aligned */}
            {canEdit && (
              <button
                onClick={() => navigate(`/edit-note/${id}`)}
                className="btn-secondary"
                style={{ marginLeft: "auto", padding: "0.3125rem 0.875rem", fontSize: "0.8125rem" }}
              >
                Edit
              </button>
            )}
          </div>
        </header>

        {/* ── Divider ── */}
        <div style={{ borderTop: "1px solid var(--border)", marginBottom: "2.75rem" }} />

        {/* ── Article body ── */}
        <article
          ref={articleRef}
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description || "<p>No content.</p>") }}
        />

        {/* ── Post footer ── */}
        <footer style={{ marginTop: "4rem", borderTop: "1px solid var(--border)", paddingTop: "2.5rem" }}>

          {/* Author bio card */}
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", padding: "1.5rem", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", marginBottom: "3rem" }}>
            {user?.profilePictureUrl
              ? <img src={user.profilePictureUrl} alt={authorName} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} onError={(e) => e.target.style.display = "none"} />
              : <span style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--bg3)", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1.125rem", fontWeight: 600, color: "var(--text2)", flexShrink: 0 }}>
                  {authorName[0]?.toUpperCase()}
                </span>
            }
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text3)", margin: "0 0 0.25rem" }}>Written by</p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", fontWeight: 400, color: "var(--text)", margin: "0 0 0.375rem" }}>{authorName}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
                √2 Technologies — writing about software, engineering, and building things carefully.
              </p>
            </div>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)" }}>
                  More to read
                </span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {related.map((r) => {
                  const rlabel = r.type || r.tag;
                  return (
                    <Link
                      key={r._id}
                      to={`/blog/${r._id}`}
                      style={{ display: "flex", flexDirection: "column", gap: "0.375rem", padding: "1rem 1.125rem", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", textDecoration: "none", color: "inherit", transition: "box-shadow 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                    >
                      {rlabel && (
                        <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--accent)" }}>{rlabel}</span>
                      )}
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.9375rem", fontWeight: 400, color: "var(--text)", margin: 0, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {r.title}
                      </p>
                      {r.readTimeMinutes && (
                        <span style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: "auto" }}>{r.readTimeMinutes} min</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back nav */}
          <Link
            to="/home"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8125rem", color: "var(--text3)", textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}
          >
            ← All posts
          </Link>
        </footer>
      </div>
    </>
  );
};

export default SingleBlogPage;
