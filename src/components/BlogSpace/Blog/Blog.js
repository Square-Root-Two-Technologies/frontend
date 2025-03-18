import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import "./Blog.css";

const Blog = () => {
  const [note, setNote] = useState(null);
  const { id } = useParams();
  const host = process.env.REACT_APP_BACKEND;

  useEffect(() => {
    const getNoteById = async (id) => {
      try {
        const response = await fetch(
          `${host}/api/notes/fetchNotesIrrespective/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const json = await response.json();
        setNote(json);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    getNoteById(id);
  }, [id]);

  if (!note) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <Spinner animation="border" style={{ color: "#a68a64" }} />
      </div>
    );
  }

  return (
    <div className="blog-page-wrapper">
      <Container className="py-5">
        <article className="blog-card">
          <header className="mb-4">
            <h1 className="blog-title">{note.title}</h1>
            <div className="blog-meta d-flex flex-wrap gap-3 justify-content-start mt-3">
              <span className="blog-badge blog-tag">
                Tag: {note.tag || "Uncategorized"}
              </span>
              {note.type && (
                <span className="blog-badge blog-type">Type: {note.type}</span>
              )}
              <span className="blog-badge blog-date">
                {new Date(note.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          <section className="blog-content">
            <p>{note.description}</p>
          </section>
        </article>
      </Container>

      <footer className="blog-footer">
        <div className="container">
          <p className="blog-footer-text">
            Last updated:{" "}
            {new Date(note.date).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="blog-footer-copyright">
            © {new Date().getFullYear()} Note Manager
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
