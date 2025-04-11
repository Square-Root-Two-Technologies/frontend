// FILE: src/components/Sidebar/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

// Now expecting more fields in recentPosts
const Sidebar = ({ recentPosts = [] }) => {
  const cardBaseClasses =
    "p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700";
  const cardTitleClasses =
    "text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200";
  const linkClasses =
    "hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors";
  const socialIconClasses =
    "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors";
  const metaTextClasses = "text-xs text-gray-500 dark:text-gray-400"; // For date/type

  // Helper function to format date
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

  return (
    <aside className="lg:col-span-1 space-y-6">
      {/* --- Section 1: Recent Posts (Enhanced) --- */}
      {recentPosts.length > 0 && (
        <div className={cardBaseClasses}>
          <h3 className={cardTitleClasses}>Recent Posts</h3>
          <ul className="space-y-3">
            {" "}
            {/* Increased spacing slightly */}
            {recentPosts.map((post) => {
              const formattedDate = formatDate(post.date);
              const category = post.type || post.tag; // Use type primarily, fallback to tag

              return (
                <li key={post._id}>
                  <Link
                    to={`/blog/${post._id}`}
                    className={`block font-medium ${linkClasses}`} // Make title slightly bolder
                  >
                    {post.title || "Untitled Post"}
                  </Link>
                  {/* Added meta information below title */}
                  <div
                    className={`mt-1 ${metaTextClasses} flex items-center flex-wrap gap-x-2`}
                  >
                    {formattedDate && <span>{formattedDate}</span>}
                    {category && formattedDate && (
                      <span>•</span> // Separator
                    )}
                    {category && (
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
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
      {/* --- End: Recent Posts --- */}

      {/* --- Section 2: Follow Us --- */}
      <div className={cardBaseClasses}>
        <h3 className={cardTitleClasses}>Follow Us</h3>
        <div className="flex space-x-4">
          <a
            href="https://github.com" // Replace with your actual GitHub link
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
            aria-label="GitHub Profile"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://linkedin.com" // Replace with your actual LinkedIn link
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://twitter.com" // Replace with your actual Twitter link
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
            aria-label="Twitter Profile"
          >
            <FaTwitter size={24} />
          </a>
          {/* Add more social links as needed */}
        </div>
      </div>
      {/* --- End: Follow Us --- */}

      {/* --- Section 3: About Snippet --- */}
      <div className={cardBaseClasses}>
        <h3 className={cardTitleClasses}>About √2 Technologies</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Sharing insights on technology, development, Salesforce, and more.
          Exploring the roots of innovation and creative solutions.
          {/* <Link to="/about" className={`block mt-2 text-sm ${linkClasses}`}>Read More</Link> */}
        </p>
      </div>
      {/* --- End: About Snippet --- */}
    </aside>
  );
};

// Update PropTypes to expect date, type, tag
Sidebar.propTypes = {
  recentPosts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      date: PropTypes.string, // Expecting date string
      type: PropTypes.string, // Optional type
      tag: PropTypes.string, // Optional tag
    }),
  ),
};

export default Sidebar;
