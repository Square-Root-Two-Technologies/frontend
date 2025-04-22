// src/components/Breadcrumbs/Breadcrumbs.js
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaChevronRight } from "react-icons/fa"; // Or use '>' character

const Breadcrumbs = ({ path = [], currentTitle }) => {
  if (!path || path.length === 0) {
    // Optionally render just Home > Current Title if no path
    return (
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-subtle mb-4 flex items-center flex-wrap"
      >
        <Link to="/" className="hover:underline text-primary">
          Home
        </Link>
        {currentTitle && (
          <FaChevronRight className="mx-1 opacity-50" size={10} />
        )}
        {currentTitle && (
          <span className="font-medium text-neutral dark:text-gray-200">
            {currentTitle}
          </span>
        )}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-subtle mb-4 flex items-center flex-wrap"
    >
      <Link to="/" className="hover:underline text-primary">
        Home
      </Link>
      <FaChevronRight className="mx-1 opacity-50" size={10} />

      {path.map((item, index) => (
        <React.Fragment key={item._id || index}>
          {index < path.length ? ( // All path items are links
            <Link
              to={`/category/${item._id}`}
              className="hover:underline text-primary"
              title={`Go to ${item.name} category`}
            >
              {item.name}
            </Link>
          ) : (
            // This case might not be needed if path only contains ancestors
            <span className="font-medium text-neutral dark:text-gray-200">
              {item.name}
            </span>
          )}
          {(index < path.length - 1 || currentTitle) && ( // Separator needed if not last item or if currentTitle exists
            <FaChevronRight className="mx-1 opacity-50" size={10} />
          )}
        </React.Fragment>
      ))}
      {/* Current page title (not a link) */}
      {currentTitle && (
        <span className="font-medium text-neutral dark:text-gray-200">
          {currentTitle}
        </span>
      )}
    </nav>
  );
};

Breadcrumbs.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  currentTitle: PropTypes.string, // Title of the current blog post
};

export default Breadcrumbs;
