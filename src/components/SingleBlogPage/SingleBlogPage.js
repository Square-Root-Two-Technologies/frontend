import React, { useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { getTypeColor } from "../../utils/typeColors";

const SingleBlogPage = () => {
  const { id } = useParams();
  const { note, fetchNoteById, isFetching, error } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if ((!note || note._id !== id) && !isFetching) {
      fetchNoteById(id);
    }
    // Optional: Scroll to top when component mounts or ID changes
    window.scrollTo(0, 0);
  }, [id, fetchNoteById, note, isFetching]);

  const handleEdit = () => {
    navigate(`/edit-note/${id}`);
  };

  // Centering Wrapper for loading/error states
  const CenteredMessage = ({ children }) => (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-160px)]">
      {" "}
      {/* Adjust min-height */}
      {children}
    </div>
  );

  if (isFetching || isUserLoading || (!note && !error && !isFetching)) {
    // Improved loading check
    return (
      <CenteredMessage>
        <LoadingSpinner />
      </CenteredMessage>
    );
  }

  if (error) {
    return (
      <CenteredMessage>
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">
            Error Loading Post
          </h2>
          <p className="text-error mb-6">{error}</p>
          <button
            onClick={() => fetchNoteById(id)}
            className="btn-primary mr-2"
          >
            Retry
          </button>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </CenteredMessage>
    );
  }

  if (!note) {
    // Handle case where fetch finished but no note found
    return (
      <CenteredMessage>
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
      </CenteredMessage>
    );
  }

  // Destructure note details only if note exists
  const {
    title = "Untitled Post",
    description = "",
    tag,
    type,
    readTimeMinutes,
    user,
    date,
  } = note;

  const authorName = user?.name || "Unknown Author";
  const postDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date";
  const typeColorClass = getTypeColor(type || tag);
  const showEditButton =
    !isUserLoading &&
    currentUser &&
    user &&
    (currentUser._id === user._id || currentUser.role === "admin");

  // This page's main content should be centered
  return (
    // Add the container wrapper here
    <div className="container mx-auto px-4 py-8">
      {/* Card remains constrained */}
      <div className={`card max-w-4xl mx-auto ${typeColorClass} border-t-4`}>
        {" "}
        {/* Adjusted max-width */}
        <Link
          to="/"
          className="text-primary hover:underline mb-6 inline-block text-sm"
        >
          ← Back to All Posts
        </Link>
        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral dark:text-gray-100 flex-1 mr-4 break-wordshyphens-auto">
            {" "}
            {/* Added hyphens */}
            {title}
          </h1>
          {showEditButton && (
            <button
              onClick={handleEdit}
              className="btn-secondary whitespace-nowrap px-3 py-1.5 text-xs"
              aria-label={`Edit post titled ${title}`}
            >
              Edit Post
            </button>
          )}
        </div>
        <div className="text-subtle mb-8 flex flex-wrap gap-x-4 gap-y-2 items-center border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-neutral dark:text-gray-200 overflow-hidden">
              {authorName
                .split(" ")
                .map((n) => n?.[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "?"}
            </div>
            <span className="font-medium text-neutral dark:text-gray-200">
              {authorName}
            </span>
          </div>
          <span>•</span>
          <time dateTime={date ? new Date(date).toISOString() : undefined}>
            {postDate}
          </time>{" "}
          {readTimeMinutes && (
            <>
              <span>•</span>
              <span>{readTimeMinutes} min read</span>
            </>
          )}
          {(type || tag) && (
            <>
              <span>•</span>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-neutral dark:text-gray-300 text-xs font-medium rounded-full capitalize">
                {type || tag}
              </span>
            </>
          )}
        </div>
        {/* Apply prose styles for typography from Tailwind Typography if installed, or use custom styles */}
        <div
          className="prose dark:prose-invert max-w-none text-neutral dark:text-gray-200 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: description || "<p>No content available for this post.</p>",
          }}
        />
      </div>
    </div>
  );
};

export default SingleBlogPage;
