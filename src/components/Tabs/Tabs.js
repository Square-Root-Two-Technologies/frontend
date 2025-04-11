// src/components/Tabs/Tabs.js
import React from "react";
import PropTypes from "prop-types";

const Tabs = ({ activeTab, setActiveTab, types = [] }) => {
  // Default types to empty array
  // Define reusable Tailwind classes for styling consistency
  const baseTextColor = "text-gray-600 dark:text-gray-400";
  const activeTextColor = "text-blue-600 dark:text-blue-400";
  const hoverTextColor = "hover:text-gray-800 dark:hover:text-gray-200";
  const activeBorderColor = "border-blue-600 dark:border-blue-400";
  const baseBorderColor = "border-transparent";
  const hoverBorderColor = "hover:border-gray-300 dark:hover:border-gray-600";

  // Ensure 'All' is always the first tab if types are provided
  const tabOrder = ["All", ...types.filter((t) => t !== "All")];

  // Don't render tabs if only 'All' is available or if types haven't loaded
  if (tabOrder.length <= 1) {
    return null;
  }

  return (
    <nav className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap">
      {/* Use a container that allows horizontal scrolling on small screens */}
      <ul className="flex -mb-px text-sm font-medium text-center">
        {tabOrder.map((type) => (
          <li key={type} className="mr-2">
            {" "}
            {/* Use margin for spacing */}
            <button
              onClick={() => setActiveTab(type)}
              // Apply dynamic classes based on whether the tab is active
              className={`inline-block p-4 rounded-t-lg border-b-2 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-600 ${
                activeTab === type
                  ? `${activeTextColor} ${activeBorderColor}` // Active state styles
                  : `${baseBorderColor} ${baseTextColor} ${hoverTextColor} ${hoverBorderColor}` // Inactive state styles
              }`}
              // Indicate the current page for accessibility
              aria-current={activeTab === type ? "page" : undefined}
            >
              {/* Capitalize the first letter of the type for display */}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Define prop types for better component usage and debugging
Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tabs;
