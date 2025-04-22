import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import NoteContext from "../../context/Notes/NoteContext"; // Keep for recentPosts
import CategoryContext from "../../context/category/CategoryContext"; // *** NEW ***
import CategoryTreeNode from "../CategoryTree/CategoryTreeNode"; // Keep for rendering tree
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"; // Keep for loading state

// Helper function to format date (keep as is or move to utils)
const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return null;
  }
};

const Sidebar = ({ recentPosts = [] }) => {
  // Accept recentPosts as prop OR get from NoteContext below
  // Get category data from CategoryContext
  const {
    categoryTree,
    fetchCategoryTree, // Function to fetch if needed
    isFetchingCategories, // Loading state for categories
    categoryTreeError, // Error state for categories
  } = useContext(CategoryContext); // *** UPDATED ***

  // Optional: If recentPosts is not passed as a prop, get it from NoteContext
  // const { recentPosts: contextRecentPosts } = useContext(NoteContext);
  // const displayRecentPosts = recentPosts.length > 0 ? recentPosts : contextRecentPosts;
  // For simplicity, assuming recentPosts is passed as a prop as in original code

  useEffect(() => {
    // Fetch category tree if needed
    if (
      categoryTree.length === 0 &&
      !isFetchingCategories &&
      !categoryTreeError
    ) {
      console.log("Sidebar: Triggering fetchCategoryTree");
      fetchCategoryTree(); // Use function from CategoryContext
    }
  }, [
    categoryTree, // Depend on tree data
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError,
  ]); // Update dependencies

  // --- Styling Classes (keep as they were) ---
  const cardBaseClasses =
    "p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700";
  const cardTitleClasses =
    "text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200";
  const linkClasses =
    "hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-gray-800 dark:text-gray-200";
  const disabledLinkClasses =
    "text-gray-400 dark:text-gray-500 cursor-not-allowed";
  const socialIconClasses =
    "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors";
  const metaTextClasses = "text-xs text-gray-500 dark:text-gray-400";

  return (
    <aside className="lg:col-span-1 space-y-6">
      {/* Recent Posts Section (Data potentially from props or NoteContext) */}
      {recentPosts && recentPosts.length > 0 && (
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
                    {/* Meta info */}
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

      {/* Browse Topics Section (Uses CategoryContext) */}
      <div className={cardBaseClasses}>
        <h3 className={cardTitleClasses}>Browse Topics</h3>
        {isFetchingCategories && categoryTree.length === 0 ? (
          <div className="flex justify-center items-center p-4">
            <LoadingSpinner size="sm" /> {/* Use category loading state */}
          </div>
        ) : categoryTreeError ? (
          <p className="text-sm text-error">{categoryTreeError}</p>
        ) : categoryTree.length > 0 ? (
          <ul className="list-none p-0 -mt-2">
            {/* Render tree using CategoryContext data */}
            {categoryTree.map((rootNode) => (
              // Pass node data; ensure CategoryTreeNode doesn't use context directly
              // It should rely on props passed down if it needs dynamic data.
              // For simple tree display, only 'node' prop might be needed.
              <CategoryTreeNode key={rootNode._id} node={rootNode} level={0} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-subtle">No categories found.</p>
        )}
      </div>

      {/* Social Links Section (Keep as is) */}
      <div className={cardBaseClasses}>
        <h3 className={cardTitleClasses}>Follow Us</h3>
        <div className="flex space-x-4">
          {/* GitHub */}
          <a
            href="https://github.com" // Replace with your actual URL
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
            aria-label="GitHub Profile"
          >
            <FaGithub size={24} />
          </a>
          {/* LinkedIn */}
          <a
            href="https://linkedin.com" // Replace with your actual URL
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={24} />
          </a>
          {/* Twitter */}
          <a
            href="https://twitter.com" // Replace with your actual URL
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
            aria-label="Twitter Profile"
          >
            <FaTwitter size={24} />
          </a>
        </div>
      </div>

      {/* About Section (Keep as is) */}
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

Sidebar.propTypes = {
  recentPosts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      date: PropTypes.string,
      slug: PropTypes.string,
      category: PropTypes.shape({ name: PropTypes.string }),
      // tag: PropTypes.string, // Was tag used here? If so add it back
    }),
  ),
  // Remove categories prop if it's now always fetched from context
  // categories: PropTypes.array,
};

export default Sidebar;
