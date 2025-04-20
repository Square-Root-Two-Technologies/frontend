import React from "react";
import PropTypes from "prop-types";

const Tabs = ({ activeCategoryId, setActiveCategoryId, categories = [] }) => {
  // --- Style definitions ---
  const baseTextColor = "text-gray-600 dark:text-gray-400";
  const activeTextColor = "text-blue-600 dark:text-blue-400";
  const hoverTextColor = "hover:text-gray-800 dark:hover:text-gray-200";
  const activeBorderColor = "border-blue-600 dark:border-blue-400";
  const baseBorderColor = "border-transparent";
  const hoverBorderColor = "hover:border-gray-300 dark:hover:border-gray-600";

  // Prepare the list of tabs, including "All"
  // Filter out any potential null/undefined categories just in case
  const validCategories = categories.filter(
    (cat) => cat && cat._id && cat.name,
  );
  const tabOptions = [{ _id: "All", name: "All" }, ...validCategories];

  // Don't render tabs if only "All" is available
  if (tabOptions.length <= 1) {
    return null;
  }

  return (
    <nav className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap scrollbar-thin">
      {" "}
      {/* Added scrollbar */}
      <ul className="flex -mb-px text-sm font-medium text-center">
        {tabOptions.map((category) => (
          <li key={category._id} className="mr-2 flex-shrink-0">
            {" "}
            {/* Added flex-shrink-0 */}
            <button
              onClick={() => setActiveCategoryId(category._id)} // Set the active ID on click
              className={`inline-block p-4 rounded-t-lg border-b-2 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-600 ${
                activeCategoryId === category._id // Compare with activeCategoryId
                  ? `${activeTextColor} ${activeBorderColor}` // Active state styles
                  : `${baseBorderColor} ${baseTextColor} ${hoverTextColor} ${hoverBorderColor}` // Inactive state styles
              }`}
              aria-current={
                activeCategoryId === category._id ? "page" : undefined
              }
            >
              {/* Display category name */}
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Tabs.propTypes = {
  activeCategoryId: PropTypes.string.isRequired, // Expecting the ID or "All"
  setActiveCategoryId: PropTypes.func.isRequired, // Function to set the active ID
  categories: PropTypes.arrayOf(
    // Expecting an array of category objects
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      // Include other fields if needed (parent, description)
    }),
  ).isRequired,
};

export default Tabs;
