// FILE: src/components/CategoriesExplorerPage/BlogPostDisplay.js
// NOTE: This component is very similar to SingleBlogPostContent.
// Applying the same changes here.

import React, { useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { getTypeColor } from "../../utils/typeColors";
import DOMPurify from "dompurify";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"; // Import Breadcrumbs

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
    // Fetch note only if slug is present and either no note is loaded,
    // the loaded note's slug doesn't match, or it's not currently fetching.
    if (slug && (!note || note.slug !== slug) && !isFetchingNote) {
      console.log(`BlogPostDisplay: Fetching note for slug: ${slug}`);
      fetchNoteBySlug(slug);
    }
    // No window scroll here, as it's part of a larger layout
  }, [slug, fetchNoteBySlug, note, isFetchingNote]); // Dependencies

  const handleEdit = () => {
    // Using window.location.href for simplicity here, but React Router's navigate is better if needed
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

  // Check if note is loaded AND matches the current slug
  if (!isFetchingNote && !noteError && (!note || note.slug !== slug)) {
    // Show loading or a 'Not Found' message if fetch likely completed but no match
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

  // If note is valid and matches slug:
  if (!note) {
    // Fallback if somehow note is null after checks (shouldn't happen)
    return <div className="p-4 text-center text-subtle">Loading post...</div>;
  }

  const {
    title = "Untitled Post",
    description = "",
    category,
    readTimeMinutes,
    user,
    date,
    _id, // For edit link
    ancestorPath = [], // Get ancestor path from note data
  } = note;

  // Sanitize HTML content
  const sanitizedDescription = DOMPurify.sanitize(
    description || "<p>No content available for this post.</p>",
    { USE_PROFILES: { html: true } },
  );

  // Prepare display data
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

  // --- MODIFICATION START ---
  // Determine if the current user can edit (owner or Admin/SuperAdmin)
  const allowedAdminRoles = ["admin", "SuperAdmin"];
  const canEdit =
    !isUserLoading && // Ensure user loading is finished
    currentUser && // Ensure user is logged in
    user && // Ensure the post has a user associated
    (currentUser._id === user._id || // Check if current user is the owner
      allowedAdminRoles.includes(currentUser.role)); // Check if current user is Admin or SuperAdmin
  // --- MODIFICATION END ---

  return (
    <article className={`card w-full ${categoryColorClass} border-t-4`}>
      {/* Breadcrumbs */}
      <Breadcrumbs path={ancestorPath} currentTitle={title} />

      {/* Header */}
      <div className="flex justify-between items-start mb-4 flex-wrap gap-y-2 gap-x-4">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral dark:text-gray-100 flex-1 mr-4 break-words hyphens-auto">
          {title}
        </h1>
        {/* Edit Button - Conditionally Rendered */}
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

      {/* Meta Info */}
      <div className="text-subtle mb-8 flex flex-wrap gap-x-4 gap-y-2 items-center border-b border-gray-200 dark:border-gray-700 pb-4">
        {/* Author Avatar and Name */}
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
        {/* Date */}
        <span aria-hidden="true">•</span>
        <time dateTime={date ? new Date(date).toISOString() : undefined}>
          {postDate}
        </time>
        {/* Read Time */}
        {readTimeMinutes && (
          <>
            <span aria-hidden="true">•</span>
            <span>{readTimeMinutes} min read</span>
          </>
        )}
        {/* Category */}
        {categoryName && (
          <>
            <span aria-hidden="true">•</span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-neutral dark:text-gray-300 text-xs font-medium rounded-full capitalize">
              {categoryName}
            </span>
          </>
        )}
      </div>

      {/* Content */}
      <div
        className="prose dark:prose-invert max-w-none text-neutral dark:text-gray-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </article>
  );
};

export default BlogPostDisplay;
