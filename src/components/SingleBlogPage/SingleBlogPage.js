import React, { useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext"; // Import UserContext
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { getTypeColor } from "../../utils/typeColors";

const SingleBlogPage = () => {
  const { id } = useParams(); // Get note ID from URL parameters
  const { note, fetchNoteById, isFetching, error } = useContext(NoteContext); // Get note state and functions
  const { currentUser, isUserLoading } = useContext(UserContext); // Get current user state and loading status
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Effect to fetch the note data when the component mounts or the ID changes
  useEffect(() => {
    // Fetch only if the note isn't loaded, is different, or if fetching isn't already in progress
    if ((!note || note._id !== id) && !isFetching) {
      console.log(`SingleBlogPage: Fetching note with ID: ${id}`);
      fetchNoteById(id);
    }
  }, [id, fetchNoteById, note, isFetching]); // Dependencies for the effect

  // Handler function to navigate to the edit page
  const handleEdit = () => {
    navigate(`/edit-note/${id}`);
  };

  // --- Loading State ---
  // Show spinner if note data is fetching OR user data is still loading (important for auth checks)
  if (isFetching || isUserLoading || (!note && !error)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        {" "}
        {/* Increased min-height */}
        <LoadingSpinner />
      </div>
    );
  }

  // --- Error State ---
  // Show error message if fetching failed
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">
            Error Loading Post
          </h2>
          <p className="text-error mb-6">{error}</p>
          <button
            onClick={() => fetchNoteById(id)} // Allow retrying the fetch
            className="btn-primary mr-2"
          >
            Retry
          </button>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // --- Not Found State ---
  // Show 'Not Found' if fetching is done, there's no error, but the note object is still null
  if (!isFetching && !note) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-neutral dark:text-gray-100 mb-4">
            Post Not Found
          </h2>
          <p className="text-subtle mb-6">
            The blog post you are looking for might have been removed or does
            not exist.
          </p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // --- Note Data Destructuring (only if note exists) ---
  const {
    title = "Untitled Post", // Default title
    description = "", // Default description
    tag,
    type,
    readTimeMinutes,
    user, // Populated user object (should include _id, name, avatarUrl, role)
    date,
  } = note; // Safely destructure from the verified 'note' object

  const authorName = user?.name || "Unknown Author";
  const authorAvatarUrl = user?.avatarUrl;
  const postDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date"; // More readable date format
  const typeColorClass = getTypeColor(type || tag);

  // --- Determine if the Edit button should be shown ---
  // Check conditions: user is loaded, user exists, and (user owns the post OR user is admin)
  const showEditButton =
    !isUserLoading &&
    currentUser &&
    user &&
    (currentUser._id === user._id || currentUser.role === "admin");

  // --- Render the Component ---
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main content card with increased max-width and top border color based on type */}
      <div className={`card max-w-6xl mx-auto ${typeColorClass} border-t-4`}>
        {/* Back Link */}
        <Link
          to="/"
          className="text-primary hover:underline mb-6 inline-block text-sm"
        >
          ← Back to All Posts
        </Link>

        {/* Header Section: Title and Optional Edit Button */}
        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
          {" "}
          {/* Added gap for wrapping */}
          {/* Post Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral dark:text-gray-100 flex-1 mr-4 break-words">
            {" "}
            {/* Added break-words */}
            {title}
          </h1>
          {/* Conditionally Render Edit Button */}
          {showEditButton && (
            <button
              onClick={handleEdit}
              className="btn-secondary whitespace-nowrap px-3 py-1.5 text-xs" // Made button smaller
              aria-label={`Edit post titled ${title}`}
            >
              Edit Post
            </button>
          )}
        </div>

        {/* Meta Information: Author, Date, Read Time, Type/Tag */}
        <div className="text-subtle mb-8 flex flex-wrap gap-x-4 gap-y-2 items-center border-b border-gray-200 dark:border-gray-700 pb-4">
          {/* Author Avatar/Initial and Name */}
          <div className="flex items-center space-x-2">
            {authorAvatarUrl ? (
              <img
                src={authorAvatarUrl}
                alt={authorName}
                className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-600" // Added border
                onError={(e) => {
                  e.target.style.display = "none";
                }} // Basic error handling for broken image links
              />
            ) : (
              // Placeholder for avatar
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-neutral dark:text-gray-200">
                {/* Generate Initials */}
                {authorName
                  .split(" ")
                  .map((n) => n?.[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </div>
            )}
            <span className="font-medium text-neutral dark:text-gray-200">
              {authorName}
            </span>
          </div>
          <span>•</span>
          {/* Publication Date */}
          <time dateTime={date ? new Date(date).toISOString() : undefined}>
            {postDate}
          </time>{" "}
          {/* Added time element */}
          {/* Estimated Read Time */}
          {readTimeMinutes && (
            <>
              <span>•</span>
              <span>{readTimeMinutes} min read</span>
            </>
          )}
          {/* Type or Tag Badge */}
          {(type || tag) && (
            <>
              <span>•</span>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-neutral dark:text-gray-300 text-xs font-medium rounded-full capitalize">
                {" "}
                {/* Added capitalize */}
                {type || tag}
              </span>
            </>
          )}
        </div>

        {/* Main Post Content - Rendered as HTML */}
        <div
          className="prose dark:prose-invert max-w-none text-neutral dark:text-gray-200 leading-relaxed" // Added leading-relaxed
          // Use dangerouslySetInnerHTML to render the HTML from the description field
          dangerouslySetInnerHTML={{
            __html: description || "<p>No content available for this post.</p>",
          }}
        />
      </div>
    </div>
  );
};

export default SingleBlogPage;
