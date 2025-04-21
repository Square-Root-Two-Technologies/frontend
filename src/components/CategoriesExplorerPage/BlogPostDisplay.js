// src/components/CategoriesExplorerPage/BlogPostDisplay.js
import React, { useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { getTypeColor } from "../../utils/typeColors";
import DOMPurify from "dompurify";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const BlogPostDisplay = () => {
  const { slug } = useParams();
  const {
    note,
    fetchNoteBySlug,
    isFetching: isFetchingNote,
    error: noteError,
  } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);

  useEffect(() => {
    if (slug && (!note || note.slug !== slug) && !isFetchingNote) {
      console.log(`BlogPostDisplay: Fetching note for slug: ${slug}`);
      fetchNoteBySlug(slug);
    }
  }, [slug, fetchNoteBySlug, note, isFetchingNote]);

  const handleEdit = () => {
    if (note && note._id) {
      window.location.href = `/edit-note/${note._id}`;
    } else {
      console.error("Cannot navigate to edit page: Note ID is missing.");
      alert("Could not find note ID for editing.");
    }
  };

  // --- Render Logic ---
  if (isFetchingNote) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (noteError) {
    return (
      <div className="card text-center max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-error mb-4">
          Error Loading Post
        </h2>
        <p className="text-error mb-6">{noteError}</p>
        <button
          onClick={() => fetchNoteBySlug(slug)}
          className="btn-primary"
          disabled={isFetchingNote}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isFetchingNote && !noteError && (!note || note.slug !== slug)) {
    return (
      <div className="card text-center max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-neutral dark:text-gray-100 mb-4">
          Post Not Found
        </h2>
        <p className="text-subtle mb-6">
          The post with slug "{slug}" could not be found. It might have been
          moved or deleted.
        </p>
      </div>
    );
  }

  if (!note) {
    return <div className="p-4 text-center text-subtle">Loading post...</div>;
  }

  // --- Note Content Rendering ---
  const {
    title = "Untitled Post",
    description = "",
    category,
    readTimeMinutes,
    user,
    date,
    _id,
    ancestorPath = [],
  } = note;

  const sanitizedDescription = DOMPurify.sanitize(
    description || "<p>No content available for this post.</p>",
    { USE_PROFILES: { html: true } },
  );
  const authorName = user?.name || "Unknown Author";
  const postDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date";
  const categoryName = category?.name;
  const categoryColorClass = getTypeColor(categoryName);
  const canEdit =
    !isUserLoading &&
    currentUser &&
    user &&
    (currentUser._id === user._id || currentUser.role === "admin");

  return (
    <article className={`card w-full ${categoryColorClass} border-t-4`}>
      <Breadcrumbs path={ancestorPath} currentTitle={title} />
      <div className="flex justify-between items-start mb-4 flex-wrap gap-y-2 gap-x-4">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral dark:text-gray-100 flex-1 mr-4 break-words hyphens-auto">
          {title}
        </h1>
        {canEdit && (
          <button
            onClick={handleEdit}
            className="btn-secondary whitespace-nowrap px-3 py-1.5 text-xs self-start"
            aria-label={`Edit post titled ${title}`}
          >
            Edit Post
          </button>
        )}
      </div>
      <div className="text-subtle mb-8 flex flex-wrap gap-x-4 gap-y-2 items-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-neutral dark:text-gray-200 overflow-hidden">
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              authorName
                ?.split(" ")
                .map((n) => n?.[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "?"
            )}
          </div>
          <span className="font-medium text-neutral dark:text-gray-200">
            {authorName}
          </span>
        </div>
        <span aria-hidden="true">•</span>
        <time dateTime={date ? new Date(date).toISOString() : undefined}>
          {postDate}
        </time>
        {readTimeMinutes && (
          <>
            <span aria-hidden="true">•</span>
            <span>{readTimeMinutes} min read</span>
          </>
        )}
        {categoryName && (
          <>
            <span aria-hidden="true">•</span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-neutral dark:text-gray-300 text-xs font-medium rounded-full capitalize">
              {categoryName}
            </span>
          </>
        )}
      </div>
      <div
        className="prose dark:prose-invert max-w-none text-neutral dark:text-gray-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </article>
  );
};

export default BlogPostDisplay;
