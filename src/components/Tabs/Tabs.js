import React from "react";
import PropTypes from "prop-types";

const Tabs = ({ activeCategoryId, setActiveCategoryId, categories = [] }) => {
  // --- No Context Needed Here - Relies on Props ---

  // --- Styling (Keep as is) ---
  const baseTextColor = "text-gray-600 dark:text-gray-400";
  const activeTextColor = "text-blue-600 dark:text-blue-400";
  const hoverTextColor = "hover:text-gray-800 dark:hover:text-gray-200";
  const activeBorderColor = "border-blue-600 dark:border-blue-400";
  const baseBorderColor = "border-transparent";
  const hoverBorderColor = "hover:border-gray-300 dark:hover:border-gray-600";

  // --- Prepare Tabs (Uses props) ---
  const validCategories = categories.filter(
    (cat) => cat && cat._id && cat.name,
  );
  const tabOptions = [{ _id: "All", name: "All" }, ...validCategories];

  // Don't render if only "All" tab exists
  if (tabOptions.length <= 1) {
    return null;
  }

  // --- Render Logic (Uses props) ---
  return (
    <nav className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap scrollbar-thin">
      <ul className="flex -mb-px text-sm font-medium text-center">
        {tabOptions.map((category) => (
          <li key={category._id} className="mr-2 flex-shrink-0">
            <button
              onClick={() => setActiveCategoryId(category._id)} // Use prop function
              className={`inline-block p-4 rounded-t-lg border-b-2 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-600 ${
                activeCategoryId === category._id // Use prop value
                  ? `${activeTextColor} ${activeBorderColor}`
                  : `${baseBorderColor} ${baseTextColor} ${hoverTextColor} ${hoverBorderColor}`
              }`}
              aria-current={
                activeCategoryId === category._id ? "page" : undefined // Use prop value
              }
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// PropTypes remain the same
Tabs.propTypes = {
  activeCategoryId: PropTypes.string.isRequired,
  setActiveCategoryId: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Tabs;
