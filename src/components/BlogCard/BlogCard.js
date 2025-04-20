import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getTypeColor } from "../../utils/typeColors"; // Ensure this path is correct
import BlogCardAnimation from "../BlogCardAnimation/BlogCardAnimation"; // Ensure path is correct

// --- SkeletonBlogCard Component --- (Keep As Is)
const SkeletonBlogCard = () => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden w-full max-w-sm mx-auto flex flex-col border-t-4 border-gray-300 dark:border-gray-600 animate-pulse`}
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

// --- DefaultAvatar Component --- (Keep As Is)
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

// --- BlogCard Component ---
const BlogCard = React.forwardRef(
  (
    {
      note,
      isFeatured = false,
      isLoading = false,
      showActions = false,
      disableAnimation = false,
      onEdit,
      onDelete,
      // isAdminView prop might not be strictly needed if actions depend on context/user role
    },
    ref,
  ) => {
    if (isLoading) {
      return <SkeletonBlogCard />;
    }

    if (!note || typeof note !== "object") {
      console.warn("BlogCard received invalid 'note' prop:", note);
      return null; // Don't render if note is invalid
    }

    // Destructure note properties, including the new 'category' object
    const {
      _id,
      title = "Untitled Post",
      description = "",
      tag, // Keep tag if you still use it for secondary info
      category, // <-- Destructure category object
      readTimeMinutes,
      user,
      date,
      slug,
    } = note;

    // Extract category name, handle potential missing category
    const categoryName = category?.name; // Use optional chaining
    const categoryId = category?._id; // May need ID for filtering/linking later

    const authorName = user?.name || "Unknown Author";
    const postDate = date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "No date";

    // Determine color based on category name
    const categoryColorClass = getTypeColor(categoryName); // Pass category name

    const hasValidSlug = typeof slug === "string" && slug.trim() !== "";

    // Button and Link Styles (Keep As Is or adjust as needed)
    const buttonBase =
      "px-3 py-1 text-xs font-medium rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
    const editButton = `${buttonBase} bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 focus:ring-blue-500`;
    const deleteButton = `${buttonBase} bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 focus:ring-red-500`;
    const readMoreLinkClass =
      "text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs";

    // Generate clean description snippet
    const descriptionSnippet = description
      ? description.replace(/<[^>]+>/g, "").substring(0, 150) +
        (description.replace(/<[^>]+>/g, "").length > 150 ? "..." : "")
      : "No description available.";

    return (
      <article
        ref={ref}
        // Apply the dynamic border color based on category
        className={`group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto flex flex-col border-t-4 ${categoryColorClass}`}
      >
        {/* Animation Area */}
        {!disableAnimation && (
          <div className="w-full h-36 flex-shrink-0 overflow-hidden">
            {/* Pass category name (or default) to animation */}
            <BlogCardAnimation type={categoryName || "default"} noteId={_id} />
          </div>
        )}

        {/* Content Area */}
        <div
          className={`p-5 flex flex-col gap-3 flex-grow ${
            disableAnimation ? "pt-5" : "" // Adjust padding if animation is disabled
          }`}
        >
          {/* Title */}
          <h2
            className={`font-bold text-gray-900 dark:text-gray-100 ${
              isFeatured ? "text-xl" : "text-lg"
            } line-clamp-2`} // Truncate title to 2 lines
          >
            {hasValidSlug ? (
              <Link
                to={`/blog/${slug}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title={title} // Add title attribute for accessibility
              >
                {title}
              </Link>
            ) : (
              <span title={title}>{title}</span> // Non-link if no slug
            )}
          </h2>

          {/* Metadata */}
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

          {/* Description Snippet */}
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 flex-grow min-h-[60px]">
            {descriptionSnippet}
          </p>

          {/* Footer: Actions & Category Badge */}
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
            {/* Actions (Edit/Delete/Read More) */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              {showActions &&
                onEdit && ( // Check if onEdit callback exists
                  <button
                    onClick={() => onEdit(_id)} // Pass ID to handler
                    className={editButton}
                    aria-label={`Edit note titled ${title}`}
                  >
                    Edit
                  </button>
                )}
              {showActions &&
                onDelete && ( // Check if onDelete callback exists
                  <button
                    onClick={() => onDelete(_id)} // Pass ID to handler
                    className={deleteButton}
                    aria-label={`Delete note titled ${title}`}
                  >
                    Delete
                  </button>
                )}
              {hasValidSlug && (
                <Link
                  to={`/blog/${slug}`}
                  className={readMoreLinkClass}
                  title={`Read more about ${title}`}
                >
                  Read More →
                </Link>
              )}
            </div>

            {/* Category Badge */}
            {categoryName && ( // Display category name if available
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full capitalize whitespace-nowrap ml-2">
                {categoryName}
              </span>
            )}
            {!categoryName &&
              tag && ( // Fallback to tag if category is missing but tag exists
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full capitalize whitespace-nowrap ml-2">
                  {tag} {/* Display tag as fallback */}
                </span>
              )}
          </div>
        </div>
      </article>
    );
  },
);

// --- PropTypes ---
BlogCard.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    tag: PropTypes.string, // Keep tag if used
    category: PropTypes.shape({
      // Expect category object
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
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
};

export default BlogCard;
