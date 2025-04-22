import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// import NoteContext from "../../context/Notes/NoteContext"; // *** REMOVED ***
import CategoryContext from "../../context/category/CategoryContext"; // *** NEW ***
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CategoryTreeNode from "../CategoryTree/CategoryTreeNode"; // Keep for rendering
import "./CategoryTree.css"; // Keep styles

// Node rendering component (can be kept internal or imported if reused)
// Ensure this version of CategoryTreeNode ONLY uses props, not context.
// const CategoryTreeNode = ({ node }) => { ... see definition in CategoriesListPage or Sidebar };

const CategoryTreePage = () => {
  // Use CategoryContext
  const {
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError, // Use error state from context
  } = useContext(CategoryContext); // *** UPDATED ***

  // Removed local loading/error states, rely on context states

  useEffect(() => {
    // Fetch if needed (logic is similar to CategoriesListPage)
    if (
      categoryTree.length === 0 &&
      !isFetchingCategories &&
      !categoryTreeError
    ) {
      fetchCategoryTree(); // Use context function
    }
    window.scrollTo(0, 0);
  }, [
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError,
  ]); // Updated dependencies

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <h1 className="text-heading mb-8 text-center">Browse Topics</h1>{" "}
      {/* Assuming .text-heading */}
      {/* Loading State */}
      {isFetchingCategories && categoryTree.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      )}
      {/* Error State */}
      {categoryTreeError && !isFetchingCategories && (
        <div className="card text-center max-w-md mx-auto">
          {" "}
          {/* Assuming .card */}
          <h2 className="text-xl font-semibold text-error mb-4">Error</h2>
          <p className="text-error mb-6">{categoryTreeError}</p>{" "}
          {/* Use context error */}
          <button onClick={fetchCategoryTree} className="btn-primary">
            {" "}
            {/* Assuming .btn-primary */}
            Retry
          </button>
        </div>
      )}
      {/* Empty State */}
      {!isFetchingCategories &&
        !categoryTreeError &&
        (!categoryTree || categoryTree.length === 0) && (
          <p className="text-center text-subtle">No categories found.</p> // Assuming .text-subtle
        )}
      \n
      {/* Tree Display */}
      {!isFetchingCategories &&
        !categoryTreeError &&
        categoryTree &&
        categoryTree.length > 0 && (
          <div className="category-tree-container bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <ul className="category-tree-root">
              {categoryTree.map((rootNode) => (
                // Ensure CategoryTreeNode relies only on props here
                <CategoryTreeNode key={rootNode._id} node={rootNode} />
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};

export default CategoryTreePage;
