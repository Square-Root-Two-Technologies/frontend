// FILE: frontend/src/components/SingleBlogPage/SingleBlogPage.js
import React, { useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { getTypeColor } from "../../utils/typeColors";
import DOMPurify from "dompurify"; // <-- Import DOMPurify

const SingleBlogPage = () => {
  const { slug } = useParams(); // Get slug from URL parameter
  const navigate = useNavigate();

  // Get necessary state and functions from NoteContext
  const {
    note, // The single note object fetched by slug
    fetchNoteBySlug, // Function to fetch the note by its slug
    isFetching, // Loading state specifically for fetching the single note
    error, // Error state for fetching the single note
  } = useContext(NoteContext);

  // Get user context for showing the edit button
  const { currentUser, isUserLoading } = useContext(UserContext);

  // Effect to fetch the note when the slug changes or component mounts
  useEffect(() => {
    console.log(
      `SingleBlogPage Effect: Current slug='${slug}'. Note loaded: ${!!note}, Note slug: '${
        note?.slug
      }', Fetching: ${isFetching}`,
    );

    // Fetch only if we have a slug, we're not already fetching,
    // and either no note is loaded OR the loaded note's slug doesn't match the URL slug.
    if (slug && (!note || note.slug !== slug) && !isFetching) {
      console.log(`-> Fetching note for slug: ${slug}`);
      fetchNoteBySlug(slug);
    }

    // Scroll to top on component mount or slug change
    window.scrollTo(0, 0);

    // Optional: Cleanup function to potentially clear the single note state
    // This helps if users navigate between posts quickly, ensuring the old post isn't briefly shown.
    // Requires adding a `clearSingleNote` function to NoteState.
    // return () => {
    //   clearSingleNote();
    // };
  }, [slug, fetchNoteBySlug, note, isFetching]); // Dependencies for the effect

  // Function to handle navigation to the edit page
  const handleEdit = () => {
    if (note && note._id) {
      // Navigate using the note's ID, assuming EditNote page still uses ID
      navigate(`/edit-note/${note._id}`);
    } else {
      console.error("Cannot navigate to edit page: Note ID is missing.");
      // Optionally show an error message to the user
      alert("Could not find note ID for editing.");
    }
  };

  // Helper component for centered messages (Loading, Error, Not Found)
  const CenteredMessage = ({ children }) => (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-160px)]">
      {children}
    </div>
  );

  // --- Render Loading State ---
  // Show spinner if actively fetching the note OR if initial load isn't done yet (no note and no error)
  if (isFetching || (!note && !error && !isFetching)) {
    return (
      <CenteredMessage>
        <LoadingSpinner />
      </CenteredMessage>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <CenteredMessage>
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">
            Error Loading Post
          </h2>
          {/* Display the specific error message from context */}
          <p className="text-error mb-6">{error}</p>
          <div className="flex gap-2 justify-center">
            {/* Retry button only makes sense if slug is present */}
            {slug && (
              <button
                onClick={() => fetchNoteBySlug(slug)}
                className="btn-primary"
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

  // --- Render Not Found State ---
  // This condition is met if fetching finished without error, but the note object is still null
  if (!note) {
    return (
      <CenteredMessage>
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-neutral dark:text-gray-100 mb-4">
            Post Not Found
          </h2>
          <p className="text-subtle mb-6">
            The blog post associated with this URL might have been removed or
            the link is incorrect.
          </p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </CenteredMessage>
    );
  }

  // --- Render Note Content ---
  // Destructure note properties with fallbacks
  const {
    title = "Untitled Post",
    description = "",
    tag,
    type,
    readTimeMinutes,
    user, // User object should be populated by the backend fetch
    date,
    _id, // Keep ID for the edit button functionality
  } = note;

  // Sanitize the HTML description before rendering
  const sanitizedDescription = DOMPurify.sanitize(
    description || "<p>No content available for this post.</p>",
    {
      USE_PROFILES: { html: true }, // Ensure standard HTML tags are allowed
    },
  );

  const authorName = user?.name || "Unknown Author";
  const postDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date";
  const effectiveType = type || tag || "default";
  const typeColorClass = getTypeColor(effectiveType);

  // Determine if the current user can edit this post
  const canEdit =
    !isUserLoading &&
    currentUser &&
    user &&
    (currentUser._id === user._id || currentUser.role === "admin");

  return (
    <div className="container mx-auto px-4 py-8">
      <article
        className={`card max-w-4xl mx-auto ${typeColorClass} border-t-4`}
      >
        {/* Back Link */}
        <Link
          to="/"
          className="text-primary hover:underline mb-6 inline-block text-sm"
        >
          {" "}
          ← Back to All Posts{" "}
        </Link>

        {/* Header: Title and Edit Button */}
        <div className="flex justify-between items-start mb-4 flex-wrap gap-y-2 gap-x-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral dark:text-gray-100 flex-1 mr-4 break-words hyphens-auto">
            {title}
          </h1>
          {canEdit && (
            <button
              onClick={handleEdit}
              className="btn-secondary whitespace-nowrap px-3 py-1.5 text-xs self-start" // Align button nicely
              aria-label={`Edit post titled ${title}`}
            >
              Edit Post
            </button>
          )}
        </div>

        {/* Meta Information */}
        <div className="text-subtle mb-8 flex flex-wrap gap-x-4 gap-y-2 items-center border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center space-x-2">
            {/* Author Avatar Placeholder */}
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-neutral dark:text-gray-200 overflow-hidden">
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={authorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                // Fallback initials
                authorName
                  .split(" ")
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
          {effectiveType !== "default" && ( // Only show if type/tag is meaningful
            <>
              <span aria-hidden="true">•</span>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-neutral dark:text-gray-300 text-xs font-medium rounded-full capitalize">
                {effectiveType}
              </span>
            </>
          )}
        </div>

        {/* Post Content */}
        <div
          className="prose dark:prose-invert max-w-none text-neutral dark:text-gray-200 leading-relaxed"
          // Use the sanitized HTML
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </article>
    </div>
  );
};

export default SingleBlogPage;
