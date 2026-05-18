import React from "react";
import { Link } from "react-router-dom";

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const stripHtml = (html) =>
  html ? html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";

/* ── Skeleton ── */
const SkeletonCard = React.forwardRef(({ hero }, ref) => (
  <article ref={ref} style={{
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: hero ? "2rem 2.5rem" : "1.375rem 1.5rem",
    display: "flex", flexDirection: "column", gap: "0.75rem",
  }}>
    <div style={{ width: "18%", height: 10, background: "var(--bg3)", borderRadius: 2 }} />
    <div style={{ width: hero ? "70%" : "88%", height: hero ? 28 : 20, background: "var(--bg3)", borderRadius: 2 }} />
    {hero && <div style={{ width: "92%", height: 16, background: "var(--bg3)", borderRadius: 2 }} />}
    <div style={{ width: "55%", height: 16, background: "var(--bg3)", borderRadius: 2 }} />
    <div style={{ marginTop: "auto", display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--bg3)" }} />
      <div style={{ width: "30%", height: 10, background: "var(--bg3)", borderRadius: 2 }} />
    </div>
  </article>
));

/* ── Hero card — full-width, used for the first featured post ── */
const HeroCard = React.forwardRef(({ note }, ref) => {
  const { _id, title, description, tag, type, readTimeMinutes, user, date } = note;
  const authorName = user?.name || "Unknown";
  const label = type || tag;
  const excerpt = stripHtml(description);
  const truncated = excerpt.length > 220 ? excerpt.slice(0, 220) + "…" : excerpt;

  return (
    <article
      ref={ref}
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "2rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem",
        transition: "box-shadow 0.2s ease-out",
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
    >
      {label && (
        <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--accent)" }}>
          {label}
        </span>
      )}

      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2.125rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.15, margin: 0, letterSpacing: "-0.01em" }}>
        <Link
          to={`/blog/${_id}`}
          style={{ textDecoration: "none", color: "inherit" }}
          onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = "var(--accent)"}
          onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = "transparent"}
        >
          {title || "Untitled"}
        </Link>
      </h2>

      {truncated && (
        <p style={{ fontSize: "1rem", color: "var(--text2)", lineHeight: 1.7, margin: 0 }}>
          {truncated}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--text3)" }}>
        {user?.profilePictureUrl
          ? <img src={user.profilePictureUrl} alt={authorName} style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
          : <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--bg3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", color: "var(--text3)", flexShrink: 0, fontWeight: 600 }}>{authorName[0]?.toUpperCase()}</span>
        }
        <span style={{ color: "var(--text2)", fontWeight: 500 }}>{authorName}</span>
        {formatDate(date) && (
          <><span style={{ opacity: 0.35 }}>·</span><time style={{ color: "var(--text3)" }}>{formatDate(date)}</time></>
        )}
        {readTimeMinutes && (
          <><span style={{ opacity: 0.35 }}>·</span><span>{readTimeMinutes} min read</span></>
        )}
        <Link
          to={`/blog/${_id}`}
          style={{ marginLeft: "auto", color: "var(--accent)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, letterSpacing: "0.01em" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          Read →
        </Link>
      </div>
    </article>
  );
});

/* ── Standard card ── */
const BlogCard = React.forwardRef(({ note, hero = false, isLoading = false }, ref) => {
  if (isLoading) return <SkeletonCard ref={ref} hero={hero} />;
  if (!note) return null;
  if (hero) return <HeroCard ref={ref} note={note} />;

  const { _id, title, description, tag, type, readTimeMinutes, user, date } = note;
  const authorName = user?.name || "Unknown";
  const label = type || tag;
  const excerpt = stripHtml(description);
  const truncated = excerpt.length > 130 ? excerpt.slice(0, 130) + "…" : excerpt;

  return (
    <article
      ref={ref}
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.375rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        transition: "box-shadow 0.2s ease-out",
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
    >
      {label && (
        <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.125rem" }}>
          {label}
        </span>
      )}

      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1875rem", fontWeight: 400, color: "var(--text)", lineHeight: 1.25, margin: 0 }}>
        <Link
          to={`/blog/${_id}`}
          style={{ textDecoration: "none", color: "inherit", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "var(--accent)"}
          onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}
        >
          {title || "Untitled"}
        </Link>
      </h2>

      {truncated && (
        <p style={{ fontSize: "0.875rem", color: "var(--text2)", lineHeight: 1.65, margin: "0.25rem 0 0", flexGrow: 1 }}>
          {truncated}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--text3)" }}>
        {user?.profilePictureUrl
          ? <img src={user.profilePictureUrl} alt={authorName} style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
          : <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--bg3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.5625rem", color: "var(--text3)", flexShrink: 0, fontWeight: 600 }}>{authorName[0]?.toUpperCase()}</span>
        }
        <span>{authorName}</span>
        {formatDate(date) && <><span style={{ opacity: 0.35 }}>·</span><time>{formatDate(date)}</time></>}
        {readTimeMinutes && <><span style={{ opacity: 0.35 }}>·</span><span>{readTimeMinutes} min</span></>}
        <Link to={`/blog/${_id}`} style={{ marginLeft: "auto", color: "var(--accent)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 500 }}>
          Read →
        </Link>
      </div>
    </article>
  );
});

export default BlogCard;
