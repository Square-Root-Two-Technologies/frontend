import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeProvider/ThemeProvider";
import NoteContext from "../../../context/Notes/NoteContext";
import "./LandingPage.css";

const SunIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const NOW_ITEMS = [
  {
    label: "Building",
    value: "√2 Technologies — a personal publishing platform",
  },
  {
    label: "Reading",
    value: "The Timeless Way of Building · Christopher Alexander",
  },
  { label: "Listening", value: "Four Tet, Burial, Jamie xx" },
  { label: "Location", value: "Dhaka → somewhere warmer" },
];

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const LandingPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { allNotes, recentPosts, initialLoadDone, isFetching } =
    useContext(NoteContext);
  const [recentPhotos, setRecentPhotos] = useState([]);

  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";

  useEffect(() => {
    fetch(`${host}/api/photos/recent?limit=6`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setRecentPhotos(data.photos); })
      .catch(() => {});
  }, [host]);

  /* pick the 4 most recent posts to show in the writing section */
  const writingItems = (
    recentPosts && recentPosts.length > 0 ? recentPosts : allNotes
  ).slice(0, 4);

  return (
    <div className="lp-root">
      {/* ── Nav ── */}
      <nav className="lp-nav" aria-label="Primary navigation">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-nav-name">
            Tanvir Raihan
          </Link>
          <div className="lp-nav-right">
            <Link to="/home" className="lp-nav-link">
              Read
            </Link>
            <Link to="/categories" className="lp-nav-link">
              Topics
            </Link>
            <a href="#photography" className="lp-nav-link">
              Photos
            </a>
            <a href="#now" className="lp-nav-link">
              Now
            </a>
            <Link to="/my-notes" className="lp-nav-link">
              Write
            </Link>
            <button
              className="lp-theme-btn"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-wrap">
          <div className="lp-hero-grid">
            <div>
              <span className="lp-hero-tag">
                Writer · Builder · Photographer
              </span>
              <h1 className="lp-hero-headline">
                Ideas worth sitting
                <br />
                with for a <em>while</em>.
              </h1>
              <p className="lp-hero-desc">
                Writing about building software, the texture of ideas, and what
                it feels like to make things carefully. Based in Kolkata, India,
                shipping slowly on purpose.
              </p>
              <div className="lp-hero-meta">
                <Link to="/home" className="lp-hero-cta">
                  Read all posts →
                </Link>
                <span className="lp-hero-reading">
                  Reading: <span>The Timeless Way of Building</span>
                </span>
              </div>
            </div>
            <div className="lp-photo-placeholder" aria-label="Portrait" />
          </div>
        </div>
      </section>

      {/* ── Writing ── */}
      <section className="lp-section" aria-labelledby="writing-heading">
        <div className="lp-wrap">
          <div className="lp-section-header">
            <h2 className="lp-section-title" id="writing-heading">
              Writing
            </h2>
            <Link to="/home" className="lp-section-all">
              All posts →
            </Link>
          </div>
          <ul className="lp-article-list">
            {!initialLoadDone && isFetching
              ? Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <li key={i}>
                      <div className="lp-article-item" style={{ opacity: 0.4 }}>
                        <span
                          className="lp-article-tag"
                          style={{
                            background: "var(--bg3)",
                            borderRadius: 2,
                            height: 12,
                            width: 48,
                            display: "block",
                          }}
                        />
                        <div>
                          <div
                            style={{
                              background: "var(--bg3)",
                              height: 18,
                              borderRadius: 2,
                              width: "70%",
                              marginBottom: 8,
                            }}
                          />
                          <div
                            style={{
                              background: "var(--bg3)",
                              height: 12,
                              borderRadius: 2,
                              width: "30%",
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  ))
              : writingItems.map((note) => (
                  <li key={note._id}>
                    <Link to={`/blog/${note._id}`} className="lp-article-item">
                      <span className="lp-article-tag">
                        {note.type || note.tag || "Post"}
                      </span>
                      <div>
                        <h3 className="lp-article-title">{note.title}</h3>
                        <div className="lp-article-meta">
                          <span>{formatDate(note.date)}</span>
                          {note.readTimeMinutes && (
                            <span>{note.readTimeMinutes} min</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
            {initialLoadDone && writingItems.length === 0 && (
              <li
                style={{
                  padding: "2rem 0",
                  color: "var(--text3)",
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                }}
              >
                No posts yet.
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* ── Photography ── */}
      <section
        className="lp-section"
        id="photography"
        aria-labelledby="photos-heading"
      >
        <div className="lp-wrap">
          <div className="lp-section-header">
            <h2 className="lp-section-title" id="photos-heading">
              Photography
            </h2>
            <Link to="/photos" className="lp-section-all">
              All photos →
            </Link>
          </div>
          <div className="lp-photo-grid">
            {recentPhotos.length > 0
              ? recentPhotos.map((photo) => (
                  <Link
                    key={photo._id}
                    to="/photos"
                    className="lp-photo-cell"
                    aria-label={photo.title || "Photo"}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title || photo.caption || "Photo"}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "var(--radius)" }}
                    />
                  </Link>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="lp-photo-cell"
                    aria-label={`Photo placeholder ${i + 1}`}
                  >
                    <div className="lp-photo-cell-placeholder" />
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── Now ── */}
      <section className="lp-section" id="now" aria-labelledby="now-heading">
        <div className="lp-wrap">
          <div className="lp-section-header">
            <h2 className="lp-section-title" id="now-heading">
              Now
            </h2>
          </div>
          <div className="lp-now">
            <p className="lp-now-title">What I'm doing right now</p>
            <ul className="lp-now-list">
              {NOW_ITEMS.map(({ label, value }) => (
                <li key={label} className="lp-now-item">
                  <span className="lp-now-label">{label}</span>
                  <span className="lp-now-value">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="lp-wrap">
        <div className="lp-footer-inner">
          <span className="lp-footer-copy">
            © {new Date().getFullYear()} Tanvir Raihan Islam
          </span>
          <nav className="lp-footer-links" aria-label="Footer">
            <Link to="/home" className="lp-footer-link">
              Writing
            </Link>
            <Link to="/photos" className="lp-footer-link">
              Photos
            </Link>
            <Link to="/login" className="lp-footer-link">
              Sign in
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
