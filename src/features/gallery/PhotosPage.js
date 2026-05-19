import React, { useState, useEffect, useCallback, useRef } from "react";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const API = process.env.REACT_APP_BACKEND || "http://localhost:5000";

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const loaderRef = useRef(null);

  const fetchPhotos = useCallback(async (pageNum) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/photos?page=${pageNum}&limit=12`);
      const data = await res.json();
      if (data.success) {
        setPhotos((prev) => pageNum === 1 ? data.photos : [...prev, ...data.photos]);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to load photos", err);
    } finally {
      setLoading(false);
    }
  }, [loading]); // eslint-disable-line

  useEffect(() => { fetchPhotos(1); }, []); // eslint-disable-line

  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => {
            const next = p + 1;
            fetchPhotos(next);
            return next;
          });
        }
      },
      { threshold: 0.5 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, loading, fetchPhotos]);

  const slides = photos.map((p) => ({
    src: p.url,
    alt: p.title || p.caption || "Photo",
    download: p.url,
    width: p.width,
    height: p.height,
  }));

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: "var(--text)", margin: "0 0 0.5rem", letterSpacing: "-0.01em" }}>
          Photography
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text2)", margin: 0 }}>
          Moments from around the world.
        </p>
      </div>

      {photos.length === 0 && !loading && (
        <p style={{ color: "var(--text3)", fontStyle: "italic", fontSize: "0.9rem" }}>No photos yet.</p>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
        gap: "0.75rem",
      }}>
        {photos.map((photo, i) => (
          <button
            key={photo._id}
            onClick={() => setLightboxIndex(i)}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
              cursor: "pointer",
              padding: 0,
              display: "block",
              width: "100%",
              aspectRatio: "4/3",
              position: "relative",
              transition: "box-shadow var(--transition)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            aria-label={photo.title || `Photo ${i + 1}`}
          >
            <img
              src={photo.url}
              alt={photo.title || photo.caption || `Photo ${i + 1}`}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {(photo.title || photo.location) && (
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
                padding: "1.5rem 0.875rem 0.75rem",
                textAlign: "left",
              }}>
                {photo.title && (
                  <p style={{ color: "#fff", fontSize: "0.8125rem", fontFamily: "var(--font-serif)", margin: 0, lineHeight: 1.3 }}>
                    {photo.title}
                  </p>
                )}
                {photo.location && (
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.6875rem", margin: "0.2rem 0 0", letterSpacing: "0.03em" }}>
                    {photo.location}
                  </p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <LoadingSpinner size="md" />
        </div>
      )}

      {hasMore && !loading && <div ref={loaderRef} style={{ height: 40 }} />}

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Download]}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.92)" },
        }}
      />
    </div>
  );
};

export default PhotosPage;
