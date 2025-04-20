// src/components/CategoryTreePage/CategoryTreePage.js
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext"; // Assuming context holds category logic
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./CategoryTree.css"; // Create this CSS file for styling

// --- Recursive Node Component ---
const CategoryTreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false); // Optional: For expand/collapse

  if (!node) return null;

  const hasChildren = node.children && node.children.length > 0;

  const toggleOpen = (e) => {
    e.stopPropagation(); // Prevent link navigation when clicking arrow
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li
      className={`category-node ${hasChildren ? "has-children" : ""} ${
        isOpen ? "is-open" : ""
      }`}
    >
      <div className="node-content">
        {hasChildren && (
          <button
            onClick={toggleOpen}
            className="toggle-arrow"
            aria-expanded={isOpen}
          >
            {isOpen ? "▼" : "▶"} {/* Or use icons */}
          </button>
        )}
        <Link
          to={`/category/${node._id}`}
          className="category-link"
          title={node.description || node.name}
        >
          {node.name}
        </Link>
      </div>
      {hasChildren && isOpen && (
        <ul className="children-list">
          {node.children.map((child) => (
            <CategoryTreeNode key={child._id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

// --- Main Page Component ---
const CategoryTreePage = () => {
  // Assuming you add fetchCategoryTree and state to NoteContext
  // Or create a dedicated CategoryContext
  const { fetchCategoryTree, categoryTree, isFetchingCategories } =
    useContext(NoteContext); // Adjust based on context setup
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTree = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Check if tree is already fetched, otherwise fetch
        if (!categoryTree || categoryTree.length === 0) {
          await fetchCategoryTree(); // Ensure this function exists in your context
        }
      } catch (err) {
        console.error("Failed to fetch category tree:", err);
        setError("Could not load category hierarchy. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadTree();
    window.scrollTo(0, 0);
  }, [fetchCategoryTree, categoryTree]); // Depend on fetch function and potentially the data itself

  const effectiveIsLoading = isLoading || isFetchingCategories; // Combine loading states if needed

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <h1 className="text-heading mb-8 text-center">Browse Topics</h1>

      {effectiveIsLoading && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      )}

      {error && !effectiveIsLoading && (
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">Error</h2>
          <p className="text-error mb-6">{error}</p>
          <button onClick={fetchCategoryTree} className="btn-primary">
            Retry
          </button>
        </div>
      )}

      {!effectiveIsLoading &&
        !error &&
        (!categoryTree || categoryTree.length === 0) && (
          <p className="text-center text-subtle">No categories found.</p>
        )}

      {!effectiveIsLoading &&
        !error &&
        categoryTree &&
        categoryTree.length > 0 && (
          <div className="category-tree-container bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <ul className="category-tree-root">
              {categoryTree.map((rootNode) => (
                <CategoryTreeNode key={rootNode._id} node={rootNode} />
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};

export default CategoryTreePage;
