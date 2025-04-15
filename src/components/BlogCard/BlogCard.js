import React from "react";
import { Link } from "react-router-dom";
import { getTypeColor } from "../../utils/typeColors";
import BlogCardAnimation from "../BlogCardAnimation/BlogCardAnimation";

const BlogCard = React.forwardRef(
  ({ note, isFeatured = false, isLoading = false }, ref) => {
    if (isLoading) {
      return (
        <article
          ref={ref}
          // Added fixed height h-[450px]
          className="group bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden w-full max-w-sm mx-auto flex flex-col border-t-4 border-gray-300 dark:border-gray-700 animate-pulse h-[450px]"
        >
          <div className="w-full h-36 bg-gray-300 dark:bg-gray-700"></div>
          <div className="p-5 flex flex-col gap-3 flex-grow">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="space-y-2 flex-grow">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
            <div className="flex justify-between items-center mt-auto pt-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-full w-1/6"></div>
            </div>
          </div>
        </article>
      );
    }

    if (!note) return null;

    const { _id, title, description, tag, type, readTimeMinutes, user, date } =
      note;
    const authorName = user?.name || "Unknown Author";
    const authorAvatarUrl = user?.avatarUrl;
    const postDate = date ? new Date(date).toLocaleDateString() : "No date";

    // Use the type primarily, fallback to tag if type is missing
    const effectiveType = type || tag || "default";
    const typeColorClass = getTypeColor(effectiveType);

    return (
      <article
        ref={ref}
        // Added fixed height h-[450px]
        className={`group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto flex flex-col border-t-4 ${typeColorClass} h-[450px]`}
      >
        <div className="w-full h-36 flex-shrink-0">
          {" "}
          {/* Added flex-shrink-0 */}
          <BlogCardAnimation type={effectiveType} noteId={_id} />
        </div>
        <div className="p-5 flex flex-col gap-3 flex-grow">
          <h2
            className={`font-bold text-gray-900 dark:text-gray-100 ${
              isFeatured ? "text-xl" : "text-lg"
            } line-clamp-2`} // Title can span 2 lines
          >
            <Link
              to={`/blog/${_id}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {title || "Untitled Post"}
            </Link>
          </h2>
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-wrap">
            {authorAvatarUrl ? (
              <img
                src={authorAvatarUrl}
                alt={authorName}
                className="h-5 w-5 rounded-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <DefaultAvatar />
            )}
            <span>{authorName}</span>
            <span>•</span>
            <span>{postDate}</span>
            {readTimeMinutes && (
              <>
                <span>•</span>
                <span>{readTimeMinutes} min read</span>
              </>
            )}
          </div>
          {/* Description takes remaining space, clamps to 3 lines */}
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 flex-grow">
            {/* Simple check for HTML or plain text */}
            {description && description.includes("<") ? (
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    description.replace(/<[^>]+>/g, "").substring(0, 150) +
                    (description.length > 150 ? "..." : ""),
                }}
              />
            ) : (
              description || "No description available."
            )}
          </p>
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
            {" "}
            {/* Added border-t */}
            <Link
              to={`/blog/${_id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
            >
              Read More →
            </Link>
            {(type || tag) && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full capitalize">
                {" "}
                {/* Added capitalize */}
                {effectiveType}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  },
);

const DefaultAvatar = () => (
  <svg
    className="h-5 w-5 text-gray-500 dark:text-gray-400"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

export default BlogCard;
