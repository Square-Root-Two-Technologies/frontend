// FILE: frontend/src/components/Sidebar/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Sidebar = ({ recentPosts = [] }) => {
  // CSS Classes for styling
  const cardBaseClasses =
    "p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700";
  const cardTitleClasses =
    "text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200";
  const linkClasses =
    "hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-gray-800 dark:text-gray-200"; // Default link color
  const disabledLinkClasses =
    "text-gray-400 dark:text-gray-500 cursor-not-allowed"; // Style for disabled links
  const socialIconClasses =
    "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors";
  const metaTextClasses = "text-xs text-gray-500 dark:text-gray-400";

  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date in Sidebar:", e);
      return "Invalid Date";
    }
  };

  return (
    <aside className="lg:col-span-1 space-y-6">
      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <div className={cardBaseClasses}>
          <h3 className={cardTitleClasses}>Recent Posts</h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => {
              const formattedDate = formatDate(post.date);
              const category = post.type || post.tag;

              // --- Use slug for linking, handle missing slug ---
              const hasValidSlug =
                typeof post.slug === "string" && post.slug.trim() !== "";
              const postLink = hasValidSlug ? `/blog/${post.slug}` : "#"; // Fallback link target
              if (!hasValidSlug) {
                console.warn(
                  `Sidebar: Recent post ID ${post._id} ("${post.title}") is missing a valid slug.`,
                );
              }
              // --- End slug handling ---

              return (
                <li key={post._id}>
                  {/* --- Updated Link with conditional styling --- */}
                  <Link
                    to={postLink}
                    className={hasValidSlug ? linkClasses : disabledLinkClasses} // Apply different style if no slug
                    aria-disabled={!hasValidSlug}
                    title={post.title || "Untitled Post"} // Title attribute
                  >
                    {/* --- End Updated Link --- */}
                    {post.title || "Untitled Post"}
                  </Link>
                  {/* Meta information (Date, Category) */}
                  <div
                    className={`mt-1 ${metaTextClasses} flex items-center flex-wrap gap-x-2`}
                  >
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
                    {category && formattedDate && (
                      <span aria-hidden="true">•</span> // Separator
                    )}
                    {category && (
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium capitalize">
                        {category}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Follow Us Section */}
      <div className={cardBaseClasses}>
        <h3 className={cardTitleClasses}>Follow Us</h3>
        <div className="flex space-x-4">
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
          {/* Add other social links here */}
        </div>
      </div>

      {/* About Section */}
      <div className={cardBaseClasses}>
        <h3 className={cardTitleClasses}>About √2 Technologies</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Sharing insights on technology, development, Salesforce, and more.
          Exploring the roots of innovation and creative solutions.
          {/* Add more descriptive text if desired */}
        </p>
      </div>
    </aside>
  );
};

// PropTypes for type checking
Sidebar.propTypes = {
  recentPosts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      date: PropTypes.string,
      slug: PropTypes.string, // Add slug to prop types
      type: PropTypes.string,
      tag: PropTypes.string,
    }),
  ),
};

export default Sidebar;
