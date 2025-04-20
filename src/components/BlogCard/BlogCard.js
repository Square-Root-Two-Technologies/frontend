import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Using PropTypes for prop validation
import { getTypeColor } from "../../utils/typeColors";
import BlogCardAnimation from "../BlogCardAnimation/BlogCardAnimation";

// --- Skeleton Card for Loading State ---
const SkeletonBlogCard = () => (
  <div
    // Removed fixed height from skeleton too for consistency
    className={`bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden w-full max-w-sm mx-auto flex flex-col border-t-4 border-gray-300 dark:border-gray-600 animate-pulse`}
  >
    {/* Fixed height for skeleton header */}
    <div className="w-full h-36 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-5 flex flex-col gap-3 flex-grow">
      {/* Skeleton content */}
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      {/* Ensure skeleton description area has a minimum height */}
      <div className="space-y-2 flex-grow min-h-[60px]">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
      </div>
      {/* Skeleton footer */}
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-1/4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
      </div>
    </div>
  </div>
);
// --- End Skeleton Card ---

// --- Default Avatar Placeholder ---
const DefaultAvatar = () => (
  <svg
    className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);
// --- End Default Avatar Placeholder ---

// --- Main BlogCard Component ---
const BlogCard = React.forwardRef(
  (
    {
      // --- Props ---
      note,
      isFeatured = false,
      isLoading = false,
      showActions = false,
      disableAnimation = false, // If true, header is completely removed
      onEdit,
      onDelete,
      isAdminView = false, // Kept for potential future use
    },
    ref, // Forwarded ref
  ) => {
    // Handle Loading State
    if (isLoading) {
      return <SkeletonBlogCard />;
    }

    // Handle Invalid Note Prop
    if (!note || typeof note !== "object") {
      console.warn("BlogCard received invalid 'note' prop:", note);
      return null; // Render nothing if the note data is bad
    }

    // Destructure Note Data with Defaults
    const {
      _id,
      title = "Untitled Post",
      description = "", // Default to empty string
      tag,
      type,
      readTimeMinutes,
      user,
      date,
      slug,
    } = note;

    // Prepare Display-Ready Data
    const authorName = user?.name || "Unknown Author";
    const postDate = date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "No date";
    const effectiveType = type || tag || "default";
    const typeColor = getTypeColor(effectiveType); // Gets border-color class
    const hasValidSlug = typeof slug === "string" && slug.trim() !== "";

    // Define Button Styles
    const buttonBase =
      "px-3 py-1 text-xs font-medium rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
    const editButton = `${buttonBase} bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 focus:ring-blue-500`;
    const deleteButton = `${buttonBase} bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 focus:ring-red-500`;
    const readMoreLinkClass =
      "text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs"; // Smaller text size

    // --- Render Component JSX ---
    return (
      <article
        ref={ref}
        // Removed fixed height h-[450px]. Card height adapts to content.
        // Apply base card styles, border color, etc.
        className={`group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto flex flex-col border-t-4 ${typeColor}`}
      >
        {/* === Conditionally Render the ENTIRE Header Div === */}
        {!disableAnimation && ( // Only render this block if animation is ENABLED
          <div className="w-full h-36 flex-shrink-0 overflow-hidden">
            {/* The actual animation component */}
            <BlogCardAnimation type={effectiveType} noteId={_id} />
          </div>
        )}
        {/* === End Conditional Header === */}

        {/* Card Body */}
        <div
          className={`p-5 flex flex-col gap-3 flex-grow ${
            disableAnimation ? "pt-5" : ""
          }`}
        >
          {" "}
          {/* Adjust padding if header removed */}
          {/* Title (Always a Link if slug is valid) */}
          <h2
            className={`font-bold text-gray-900 dark:text-gray-100 ${
              isFeatured ? "text-xl" : "text-lg"
            } line-clamp-2`}
          >
            {hasValidSlug ? (
              <Link
                to={`/blog/${slug}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title={title}
              >
                {title}
              </Link>
            ) : (
              <span title={title}>{title}</span> // Fallback if no slug
            )}
          </h2>
          {/* Meta Info (Author, Date, Read Time) */}
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-wrap">
            <DefaultAvatar />
            <span>{authorName}</span>
            <span>•</span>
            <time dateTime={date ? new Date(date).toISOString() : undefined}>
              {postDate}
            </time>
            {readTimeMinutes && (
              <>
                <span>•</span>
                <span>{readTimeMinutes} min read</span>
              </>
            )}
          </div>
          {/* Description Snippet (Plain text preview) */}
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 flex-grow min-h-[60px]">
            {" "}
            {/* Min height for consistency */}
            {
              description
                ? description.replace(/<[^>]+>/g, "").substring(0, 150) + // Strip HTML tags for preview
                  (description.replace(/<[^>]+>/g, "").length > 150
                    ? "..."
                    : "") // Add ellipsis if long
                : "No description available." // Fallback text
            }
          </p>
          {/* Footer: Contains Actions/Link + Tag */}
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
            {/* Left Side: Actions and/or Read More Link */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              {" "}
              {/* Use flex-wrap for responsiveness */}
              {/* Edit Button (Conditionally Shown) */}
              {showActions && (
                <button
                  onClick={() =>
                    onEdit && typeof onEdit === "function" && onEdit(_id)
                  }
                  className={editButton}
                  aria-label={`Edit note titled ${title}`}
                >
                  Edit
                </button>
              )}
              {/* Delete Button (Conditionally Shown) */}
              {showActions && (
                <button
                  onClick={() =>
                    onDelete && typeof onDelete === "function" && onDelete(_id)
                  }
                  className={deleteButton}
                  aria-label={`Delete note titled ${title}`}
                >
                  Delete
                </button>
              )}
              {/* Read More Link (Conditionally Shown based on slug) */}
              {hasValidSlug && (
                <Link
                  to={`/blog/${slug}`}
                  className={readMoreLinkClass}
                  title={`Read more about ${title}`}
                >
                  Read More →
                </Link>
              )}
              {/* Optional: Placeholder if no slug AND no actions shown */}
              {/* {!hasValidSlug && !showActions && (
                <span className="text-gray-400 dark:text-gray-500 text-xs cursor-not-allowed">
                  Read More →
                </span>
              )} */}
            </div>

            {/* Right Side: Tag/Type */}
            {(type || tag) && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full capitalize whitespace-nowrap ml-2">
                {" "}
                {/* Added margin */}
                {effectiveType}
              </span>
            )}
          </div>
          {/* End Footer */}
        </div>
        {/* End Card Body */}
      </article>
    );
  },
);
// --- End Main BlogCard Component ---

// --- PropTypes Definition ---
BlogCard.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    tag: PropTypes.string,
    type: PropTypes.string,
    readTimeMinutes: PropTypes.number,
    user: PropTypes.shape({ name: PropTypes.string }),
    date: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  isFeatured: PropTypes.bool,
  isLoading: PropTypes.bool,
  showActions: PropTypes.bool,
  disableAnimation: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isAdminView: PropTypes.bool,
};
// --- End PropTypes Definition ---

export default BlogCard; // Export the component
