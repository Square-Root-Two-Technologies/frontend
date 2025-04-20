// FILE: src/components/CategoryTree/CategoryTreeNode.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const CategoryTreeNode = ({
  node,
  level = 0,
  linkTarget = "_self",
  currentNodeId, // NEW: ID of the category being viewed on the page
  ancestorPathIds = [], // NEW: Array of ancestor IDs for the current node
}) => {
  // NEW: Determine default expansion state
  const isAncestorOrCurrent =
    ancestorPathIds.includes(node._id) || node._id === currentNodeId;
  const [isOpen, setIsOpen] = useState(isAncestorOrCurrent || level < 1); // Expand if ancestor, current, or top level

  // NEW: Effect to open if it becomes the current node after initial render
  useEffect(() => {
    if (node._id === currentNodeId && !isOpen) {
      setIsOpen(true);
    }
  }, [currentNodeId, node._id, isOpen, ancestorPathIds, level]);

  if (!node) return null;

  const hasChildren = node.children && node.children.length > 0;

  const toggleOpen = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  // NEW: Determine highlighting state
  const isCurrent = node._id === currentNodeId;

  const linkClasses = `text-sm hover:underline transition-colors duration-150 ease-in-out inline-block py-0.5 px-1 rounded
    ${
      isCurrent
        ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-100 dark:bg-blue-900/30" // Highlight style
        : "text-neutral dark:text-gray-300 hover:text-primary dark:hover:text-blue-400"
    }`;

  const buttonClasses =
    "text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mr-1 focus:outline-none p-1";

  const nodeContainerClasses = "py-0.5"; // Reduced padding

  const childrenContainerClasses =
    "pl-4 border-l border-dashed border-gray-300 dark:border-gray-600 ml-2";

  return (
    <li className={nodeContainerClasses}>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={toggleOpen}
            className={buttonClasses}
            aria-expanded={isOpen}
            aria-label={
              isOpen ? `Collapse ${node.name}` : `Expand ${node.name}`
            }
            title={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? (
              <FaChevronDown size={10} />
            ) : (
              <FaChevronRight size={10} />
            )}
          </button>
        ) : (
          <span className="inline-block w-5 mr-1"></span>
        )}
        <Link
          to={`/category/${node._id}`}
          target={linkTarget}
          className={linkClasses}
          title={node.description || `View posts in ${node.name}`}
        >
          {node.name}
        </Link>
      </div>
      {hasChildren && isOpen && (
        <ul className={childrenContainerClasses}>
          {node.children.map((child) => (
            <CategoryTreeNode
              key={child._id}
              node={child}
              level={level + 1}
              linkTarget={linkTarget}
              currentNodeId={currentNodeId} // Pass down
              ancestorPathIds={ancestorPathIds} // Pass down
            />
          ))}
        </ul>
      )}
    </li>
  );
};

CategoryTreeNode.propTypes = {
  node: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    children: PropTypes.array,
    parent: PropTypes.string, // Added parent prop if needed for flattening
  }).isRequired,
  level: PropTypes.number,
  linkTarget: PropTypes.string,
  currentNodeId: PropTypes.string, // NEW
  ancestorPathIds: PropTypes.arrayOf(PropTypes.string), // NEW
};

export default CategoryTreeNode;
