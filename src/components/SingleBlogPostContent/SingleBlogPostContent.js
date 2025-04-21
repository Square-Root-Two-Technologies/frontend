import React, { useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"; // Keep Breadcrumbs here if you want them per post
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
    // This effect now runs whenever the slug changes for this component instance
    console.log(
      `SingleBlogPostContent Effect: Slug='${slug}'. Fetching: ${isFetchingNote}`,
    );
    if (slug && !isFetchingNote) {
      console.log(`-> Fetching note content for slug: ${slug}`);
      fetchNoteBySlug(slug); // This updates the 'note' in NoteContext
    }
    window.scrollTo(0, 0); // Scroll to top on content load
  }, [slug, fetchNoteBySlug, isFetchingNote]); // Depend only on slug and fetch function

  const handleEdit = () => {
    if (note && note._id) {
      navigate(`/edit-note/${note._id}`);
    } else {
      console.error("Cannot navigate to edit page: Note ID is missing.");
      alert("Could not find note ID for editing.");
    }
  };

  // --- Rendering Logic (mostly moved from SingleBlogPage) ---

  const CenteredMessage = ({ children }) => (
    <div className="flex justify-center items-center min-h-[calc(100vh-250px)]">
      {" "}
      {/* Adjusted min-height */}
      {children}
    </div>
  );

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

  // Important: Check if the loaded note matches the current slug
  if (!note || note.slug !== slug) {
    // This state occurs briefly between route change and fetch completion,
    // or if the fetch failed silently or the note doesn't match.
    // Can show a minimal loading or null. If it persists, there's an issue.
    console.warn(
      `Mismatch: slug=${slug}, note.slug=${note?.slug}. Waiting for fetch or error.`,
    );
    return (
      <CenteredMessage>
        <LoadingSpinner />
      </CenteredMessage>
    ); // Or return null;
  }

  // --- Destructure note data only after confirming it exists and matches slug ---
  const {
    title = "Untitled Post",
    description = "",
    category,
    readTimeMinutes,
    user,
    date,
    _id, // Keep _id if needed for keys or edit links
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
  const categoryColorClass = getTypeColor(categoryName); // You might remove this if the border is on the layout
  const canEdit =
    !isUserLoading &&
    currentUser &&
    user &&
    (currentUser._id === user._id || currentUser.role === "admin");

  return (
    // Removed outer container/flex layout, as that's handled by BlogLayout
    <article
      className={`card w-full max-w-4xl ${categoryColorClass} border-t-4`}
    >
      {" "}
      {/* Keep card styling */}
      <Breadcrumbs path={ancestorPath} currentTitle={title} />{" "}
      {/* Breadcrumbs stay with content */}
      {/* <Link to="/" className="text-primary hover:underline mb-6 inline-block text-sm">
            ← Back to All Posts
        </Link> */}{" "}
      {/* Decide if you want this back link */}
      <div className="flex justify-between items-start mb-4 flex-wrap gap-y-2 gap-x-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral dark:text-gray-100 flex-1 mr-4 break-words hyphens-auto">
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
      {/* Meta Information */}
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
            <Link
              to={`/category/${category?._id}`}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-neutral dark:text-gray-300 text-xs font-medium rounded-full capitalize hover:underline"
            >
              {categoryName}
            </Link>
          </>
        )}
      </div>
      {/* Post Content */}
      <div
        className="prose dark:prose-invert max-w-none text-neutral dark:text-gray-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </article>
  );
};

export default SingleBlogPostContent;
