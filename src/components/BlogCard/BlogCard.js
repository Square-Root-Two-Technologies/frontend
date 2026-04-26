import React from "react";
import { Link } from "react-router-dom";

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* Skeleton card shown while loading */
const SkeletonCard = React.forwardRef(({ isFeatured }, ref) => (
  <article
    ref={ref}
    style={{
      background: "var(--bg2)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      minHeight: isFeatured ? 220 : "auto",
    }}
  >
    <div style={{ width: "30%", height: 10, background: "var(--bg3)", borderRadius: 2 }} />
    <div style={{ width: "85%", height: 22, background: "var(--bg3)", borderRadius: 2 }} />
    <div style={{ width: "95%", height: 14, background: "var(--bg3)", borderRadius: 2 }} />
    <div style={{ width: "70%", height: 14, background: "var(--bg3)", borderRadius: 2 }} />
    <div style={{ marginTop: "auto", width: "25%", height: 10, background: "var(--bg3)", borderRadius: 2 }} />
  </article>
));

const BlogCard = React.forwardRef(({ note, isFeatured = false, isLoading = false }, ref) => {
  if (isLoading) return <SkeletonCard ref={ref} isFeatured={isFeatured} />;
  if (!note) return null;

  const { _id, title, description, tag, type, readTimeMinutes, user, date } = note;
  const authorName = user?.name || "Unknown";
  const postDate = formatDate(date);
  const label = type || tag;

  /* strip html from description preview */
  const plainText = description
    ? description.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    : "";
  const excerpt = plainText.length > 120 ? plainText.slice(0, 120) + "…" : plainText;

  return (
    <article
      ref={ref}
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        transition: "box-shadow var(--transition)",
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Type label */}
      {label && (
        <span style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--accent)" }}>
          {label}
        </span>
      )}

      {/* Title */}
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: isFeatured ? "1.25rem" : "1.1rem", fontWeight: 400, color: "var(--text)", lineHeight: 1.25, margin: 0 }}>
        <Link to={`/blog/${_id}`} style={{ textDecoration: "none", color: "inherit" }}>
          {title || "Untitled"}
        </Link>
      </h2>

      {/* Excerpt */}
      {excerpt && (
        <p style={{ fontSize: "0.875rem", color: "var(--text2)", lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
          {excerpt}
        </p>
      )}

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text3)" }}>
        {user?.avatarUrl
          ? <img src={user.avatarUrl} alt={authorName} style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
          : <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--bg3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", color: "var(--text3)", flexShrink: 0 }}>{authorName[0]?.toUpperCase()}</span>
        }
        <span>{authorName}</span>
        {postDate && <><span style={{ opacity: 0.4 }}>·</span><time>{postDate}</time></>}
        {readTimeMinutes && <><span style={{ opacity: 0.4 }}>·</span><span>{readTimeMinutes} min</span></>}
        <Link to={`/blog/${_id}`} style={{ marginLeft: "auto", color: "var(--accent)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 500 }}>
          Read →
        </Link>
      </div>
    </article>
  );
});

export default BlogCard;
