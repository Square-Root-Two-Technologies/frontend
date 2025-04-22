// FILE: src/components/SingleBlogPostContent/SingleBlogPostContent.js
import React, { useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"; // Assuming you have this component
import { getTypeColor } from "../../utils/typeColors";
import DOMPurify from "dompurify";

const SingleBlogPostContent = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
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
    console.log(
      `SingleBlogPostContent Effect: Slug='${slug}'. Fetching: ${isFetchingNote}`,
    );
    if (slug && !isFetchingNote) {
      // Check if the current note matches the slug before fetching again
      // This check was removed to ensure fresh data is fetched when slug changes,
      // even if a note with a different slug was previously loaded.
      console.log(`-> Fetching note content for slug: ${slug}`);
      fetchNoteBySlug(slug); // Fetch based on slug change
    }
    window.scrollTo(0, 0); // Scroll to top on slug change
  }, [slug, fetchNoteBySlug, isFetchingNote]); // Dependency array

  const handleEdit = () => {
    if (note && note._id) {
      navigate(`/edit-note/${note._id}`);
    } else {
      console.error("Cannot navigate to edit page: Note ID is missing.");
      // Optionally show a user-friendly message
      alert("Could not find note ID for editing.");
    }
  };

  // Helper for centered messages (Loading, Error, Not Found)
  const CenteredMessage = ({ children }) => (
    <div className="flex justify-center items-center min-h-[calc(100vh-250px)]">
      {" "}
      {/* Adjusted min-height */}
      {children}
    </div>
  );

  // --- Render Logic ---

  if (isFetchingNote) {
    return (
      <CenteredMessage>
        <LoadingSpinner />
      </CenteredMessage>
    );
  }

  if (noteError) {
    return (
      <CenteredMessage>
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">
            Error Loading Post
          </h2>
          <p className="text-error mb-6">{noteError}</p>
          <div className="flex gap-2 justify-center">
            {/* Retry button only if slug exists */}
            {slug && (
              <button
                onClick={() => fetchNoteBySlug(slug)}
                className="btn-primary"
                disabled={isFetchingNote}
              >
                Retry
              </button>
            )}
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </CenteredMessage>
    );
  }

  // Condition after loading and error checks:
  // If not fetching, no error, but note is null OR note's slug doesn't match URL slug
  // This can happen briefly during navigation or if fetch failed silently (unlikely with error handling)
  // Or if the note was not found (backend returned success=false or 404)
  if (!note || note.slug !== slug) {
    console.warn(
      `Mismatch: slug=${slug}, note.slug=${note?.slug}. Waiting for fetch or error.`,
    );
    // Show loading spinner here as well, as it might still be fetching the correct note
    // Or, if you are sure the fetch completed and it's genuinely not found:
    // return (
    //   <CenteredMessage>
    //     <div className="card text-center max-w-md mx-auto">
    //       <h2 className="text-xl font-semibold text-neutral dark:text-gray-100 mb-4">Post Not Found</h2>
    //       <p className="text-subtle mb-6">The blog post might have been moved or deleted.</p>
    //       <Link to="/" className="btn-primary">Back to Home</Link>
    //     </div>
    //   </CenteredMessage>
    // );
    // For now, showing loading is safer during transitions
    return (
      <CenteredMessage>
        <LoadingSpinner />
      </CenteredMessage>
    );
  }

  // If note is loaded and matches slug, extract data
  const {
    title = "Untitled Post",
    description = "",
    category,
    readTimeMinutes,
    user,
    date,
    _id, // Needed for edit link
    ancestorPath = [], // Get ancestor path from note data
  } = note;

  // Sanitize HTML content
  const sanitizedDescription = DOMPurify.sanitize(
    description || "<p>No content available for this post.</p>",
    { USE_PROFILES: { html: true } }, // Ensure HTML is allowed
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
  const categoryColorClass = getTypeColor(categoryName); // Get color based on category name

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
    <article
      className={`card w-full max-w-4xl ${categoryColorClass} border-t-4`}
    >
      {" "}
      {/* Added max-width */}
      {/* Breadcrumbs */}
      <Breadcrumbs path={ancestorPath} currentTitle={title} />{" "}
      {/* Use Breadcrumbs component */}
      {/* Header Section */}
      {/* Removed Back Link - handled by layout potentially */}
      <div className="flex justify-between items-start mb-4 flex-wrap gap-y-2 gap-x-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral dark:text-gray-100 flex-1 mr-4 break-words hyphens-auto">
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
      {/* Meta Information */}
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
              // Fallback initials or icon
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
        {/* Category Link */}
        {categoryName && (
          <>
            <span aria-hidden="true">•</span>
            <Link
              to={`/category/${category?._id}`} // Link to category page
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-neutral dark:text-gray-300 text-xs font-medium rounded-full capitalize hover:underline"
            >
              {categoryName}
            </Link>
          </>
        )}
      </div>
      {/* Post Content */}
      <div
        className="prose dark:prose-invert max-w-none text-neutral dark:text-gray-200 leading-relaxed" // Apply prose for typography styling
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </article>
  );
};

export default SingleBlogPostContent;
