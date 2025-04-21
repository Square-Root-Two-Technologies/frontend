import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getTypeColor } from "../../utils/typeColors";
import BlogCardAnimation from "../BlogCardAnimation/BlogCardAnimation";

// --- UI Improvement Start: Added updatedAt to prop types ---
const NoteShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  tag: PropTypes.string,
  category: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
  readTimeMinutes: PropTypes.number,
  user: PropTypes.shape({ name: PropTypes.string }),
  date: PropTypes.string, // Creation date
  updatedAt: PropTypes.string, // Last updated date
  slug: PropTypes.string,
  isFeatured: PropTypes.bool, // Added isFeatured here
});
// --- UI Improvement End ---

const SkeletonBlogCard = () => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden w-full max-w-sm mx-auto flex flex-col border-t-4 border-gray-300 dark:border-gray-600 animate-pulse h-full`}
  >
    <div className="w-full h-36 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-5 flex flex-col gap-3 flex-grow">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="space-y-2 flex-grow min-h-[60px]">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
      </div>
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-1/4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
      </div>
    </div>
  </div>
);

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

const BlogCard = React.forwardRef(
  (
    {
      note,
      // isFeatured is now part of the note object, but keep prop for FeaturedPosts section if needed
      isLoading = false,
      showActions = false, // Used to show Edit/Delete and hide Read More
      disableAnimation = false,
      onEdit,
      onDelete,
    },
    ref,
  ) => {
    if (isLoading) {
      return <SkeletonBlogCard />;
    }

    if (!note || typeof note !== "object") {
      console.warn("BlogCard received invalid 'note' prop:", note);
      return null;
    }

    const {
      _id,
      title = "Untitled Post",
      description = "",
      tag,
      category,
      readTimeMinutes,
      user,
      date, // Creation date
      updatedAt, // Last updated date
      slug,
      isFeatured = false, // Default to false if not present
    } = note; // Destructure isFeatured from note

    const categoryName = category?.name;
    const categoryId = category?._id;
    const authorName = user?.name || "Unknown Author";

    const formatDate = (dateString) => {
      if (!dateString) return "No date";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (e) {
        return "Invalid date";
      }
    };

    const postDate = formatDate(date);
    const updatedDate = formatDate(updatedAt);
    const showUpdated = updatedAt && updatedAt !== date;

    const categoryColorClass = getTypeColor(categoryName);
    const hasValidSlug = typeof slug === "string" && slug.trim() !== "";

    const buttonBase =
      "px-3 py-1 text-xs font-medium rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
    const editButton = `${buttonBase} bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 focus:ring-blue-500`;
    const deleteButton = `${buttonBase} bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 focus:ring-red-500`;
    const readMoreLinkClass =
      "text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs";

    const descriptionSnippet = description
      ? description.replace(/<[^>]+>/g, "").substring(0, 150) +
        (description.replace(/<[^>]+>/g, "").length > 150 ? "..." : "")
      : "No description available.";

    return (
      <article
        ref={ref}
        // --- UI Improvement: Added relative positioning for badge ---
        className={`relative group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto flex flex-col border-t-4 ${categoryColorClass} h-full`}
        // --- UI Improvement End ---
      >
        {/* --- UI Improvement Start: Featured Badge --- */}
        {isFeatured && (
          <span className="absolute top-2 right-2 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow">
            Featured
          </span>
        )}
        {/* --- UI Improvement End --- */}

        {/* Animation Area */}
        {!disableAnimation && (
          <div className="w-full h-36 flex-shrink-0 overflow-hidden">
            <BlogCardAnimation type={categoryName || "default"} noteId={_id} />
          </div>
        )}

        {/* Content Area */}
        <div
          className={`p-5 flex flex-col gap-3 flex-grow ${
            disableAnimation ? "pt-5" : ""
          }`}
        >
          {/* Title */}
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
              <span title={title}>{title}</span>
            )}
          </h2>

          {/* Meta Info */}
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-wrap">
            <DefaultAvatar />
            <span>{authorName}</span>
            <span>•</span>
            <time
              dateTime={date ? new Date(date).toISOString() : undefined}
              title={`Created: ${new Date(date).toLocaleString()}`}
            >
              {postDate}
            </time>
            {/* --- UI Improvement Start: Show Updated Date --- */}
            {showUpdated && (
              <>
                <span>•</span>
                <span
                  title={`Last updated: ${new Date(
                    updatedAt,
                  ).toLocaleString()}`}
                >
                  Updated: {updatedDate}
                </span>
              </>
            )}
            {/* --- UI Improvement End --- */}
            {readTimeMinutes && (
              <>
                <span>•</span>
                <span>{readTimeMinutes} min read</span>
              </>
            )}
          </div>

          {/* Description Snippet */}
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 flex-grow min-h-[60px]">
            {descriptionSnippet}
          </p>

          {/* Footer: Actions/Links & Category/Tag */}
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              {showActions && onEdit && (
                <button
                  onClick={() => onEdit(_id)}
                  className={editButton}
                  aria-label={`Edit note titled ${title}`}
                >
                  Edit
                </button>
              )}
              {showActions && onDelete && (
                <button
                  onClick={() => onDelete(_id)}
                  className={deleteButton}
                  aria-label={`Delete note titled ${title}`}
                >
                  Delete
                </button>
              )}
              {/* --- UI Improvement Start: Hide Read More when Actions are shown --- */}
              {!showActions && hasValidSlug && (
                <Link
                  to={`/blog/${slug}`}
                  className={readMoreLinkClass}
                  title={`Read more about ${title}`}
                >
                  Read More →
                </Link>
              )}
              {/* --- UI Improvement End --- */}
            </div>

            {/* Category or Tag */}
            {categoryName ? (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full capitalize whitespace-nowrap ml-2">
                {categoryName}
              </span>
            ) : tag ? (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full capitalize whitespace-nowrap ml-2">
                {tag} {/* Fallback to tag if no category */}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    );
  },
);

BlogCard.propTypes = {
  note: NoteShape.isRequired, // Use the updated shape
  // isFeatured: PropTypes.bool, // Keep if used externally, otherwise rely on note.isFeatured
  isLoading: PropTypes.bool,
  showActions: PropTypes.bool,
  disableAnimation: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default BlogCard;
