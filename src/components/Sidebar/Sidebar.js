// src/components/Sidebar/Sidebar.js
import React, { useContext, useEffect } from "react"; // Added useContext, useEffect
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import NoteContext from "../../context/Notes/NoteContext"; // Import context
import CategoryTreeNode from "../CategoryTree/CategoryTreeNode"; // Import the reusable node
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"; // For loading state

const Sidebar = ({ recentPosts = [] /* categories removed as prop */ }) => {
  // Get tree data from context
  const {
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories, // Use the shared loading state
    categoryTreeError, // Use the shared error state
  } = useContext(NoteContext);

  // Fetch tree if needed (e.g., if sidebar loads before main content)
  useEffect(() => {
    if (
      categoryTree.length === 0 &&
      !isFetchingCategories &&
      !categoryTreeError
    ) {
      console.log("Sidebar: Triggering fetchCategoryTree");
      fetchCategoryTree();
    }
  }, [
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError,
  ]);

  // --- Styling Classes (keep existing or adjust) ---
  const cardBaseClasses =
    "p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700";
  const cardTitleClasses =
    "text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200";
  const linkClasses =
    "hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-gray-800 dark:text-gray-200";
  const disabledLinkClasses =
    "text-gray-400 dark:text-gray-500 cursor-not-allowed";
  // const categoryLinkClasses = "block py-1 text-sm hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-gray-700 dark:text-gray-300"; // Replaced by tree
  const socialIconClasses =
    "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors";
  const metaTextClasses = "text-xs text-gray-500 dark:text-gray-400";

  const formatDate = (dateString) => {
    /* ... (keep existing format function) ... */
  };

  return (
    <aside className="lg:col-span-1 space-y-6">
      {/* Recent Posts Card (Keep as is) */}
      {recentPosts.length > 0 && (
        <div className={cardBaseClasses}>
          <h3 className={cardTitleClasses}>Recent Posts</h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => {
              const formattedDate = formatDate(post.date);
              const categoryName = post.category?.name;
              const hasValidSlug =
                typeof post.slug === "string" && post.slug.trim() !== "";
              const postLink = hasValidSlug ? `/blog/${post.slug}` : "#";
              return (
                <li key={post._id}>
                  <Link
                    to={postLink}
                    className={hasValidSlug ? linkClasses : disabledLinkClasses}
                    aria-disabled={!hasValidSlug}
                    title={post.title || "Untitled Post"}
                  >
                    {post.title || "Untitled Post"}
                  </Link>
                  <div
                    className={`mt-1 ${metaTextClasses} flex items-center flex-wrap gap-x-2`}
                  >
                    {/* ... date/category meta ... */}
                    {formattedDate && (
                      <time
                        dateTime={
                          post.date
                            ? new Date(post.date).toISOString()
                            : undefined
                        }
                      >
                        {formattedDate}
                      </time>
                    )}
                    {categoryName && formattedDate && (
                      <span aria-hidden="true">•</span>
                    )}
                    {categoryName && (
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium capitalize">
                        {categoryName}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* --- Category Tree Card (NEW) --- */}
      <div className={cardBaseClasses}>
        <h3 className={cardTitleClasses}>Browse Topics</h3>
        {isFetchingCategories && categoryTree.length === 0 ? (
          <div className="flex justify-center items-center p-4">
            {" "}
            <LoadingSpinner />{" "}
          </div>
        ) : categoryTreeError ? (
          <p className="text-sm text-error">{categoryTreeError}</p>
        ) : categoryTree.length > 0 ? (
          <ul className="list-none p-0 -mt-2">
            {" "}
            {/* Adjust margin if needed */}
            {categoryTree.map((rootNode) => (
              <CategoryTreeNode key={rootNode._id} node={rootNode} level={0} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-subtle">No categories found.</p>
        )}
      </div>

      {/* Social/About Cards (Keep as is) */}
      <div className={cardBaseClasses}>
        <h3 className={cardTitleClasses}>Follow Us</h3>
        <div className="flex space-x-4">
          {/* ... social links ... */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
            aria-label="GitHub Profile"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
            aria-label="Twitter Profile"
          >
            <FaTwitter size={24} />
          </a>
        </div>
      </div>
      <div className={cardBaseClasses}>
        <h3 className={cardTitleClasses}>About √2 Technologies</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Sharing insights on technology, development, Salesforce, and more.
          Exploring the roots of innovation and creative solutions.
        </p>
      </div>
    </aside>
  );
};

// Update PropTypes: 'categories' is no longer passed as a prop
Sidebar.propTypes = {
  recentPosts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      date: PropTypes.string,
      slug: PropTypes.string,
      category: PropTypes.shape({ name: PropTypes.string }),
      tag: PropTypes.string,
    }),
  ),
};

export default Sidebar;
