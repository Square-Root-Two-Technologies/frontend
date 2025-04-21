import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import NoteContext from "../../context/Notes/NoteContext"; // *** REMOVED ***
import CategoryContext from "../../context/category/CategoryContext"; // *** NEW ***
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CategoryTreeNode from "../CategoryTree/CategoryTreeNode"; // Keep for tree view

const CategoriesListPage = () => {
  // Get data from CategoryContext
  const {
    categoryTree, // Use tree for both views potentially
    categories, // Or use flat list for list view
    fetchCategoryTree, // Function to fetch/refresh
    isFetchingCategories, // Loading state
    categoryTreeError, // Error state
  } = useContext(CategoryContext); // *** UPDATED ***

  const [viewMode, setViewMode] = useState("list"); // 'list' or 'tree'

  useEffect(() => {
    // Fetch categories if they are not already loaded or being fetched
    if (
      categoryTree.length === 0 && // Check tree, assuming it's primary source now
      !isFetchingCategories &&
      !categoryTreeError
    ) {
      console.log("CategoriesListPage: Triggering fetchCategoryTree");
      fetchCategoryTree(); // Use function from CategoryContext
    }
    window.scrollTo(0, 0); // Scroll to top on mount/view change
  }, [
    categoryTree, // Depend on the data itself
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError,
  ]); // Dependencies updated

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "list" ? "tree" : "list"));
  };

  // --- Styling Classes (keep as they were) ---
  const headingClass =
    "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center";
  const subHeadingClass = "text-center text-gray-600 dark:text-gray-400 mb-8";
  const cardClass =
    "block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all duration-200";
  const categoryNameClass = "text-xl font-semibold text-primary mb-2";
  const categoryDescClass = "text-sm text-gray-600 dark:text-gray-400";
  const buttonBase =
    "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out";
  const activeBtn = "bg-primary text-white focus:ring-primary";
  const inactiveBtn =
    "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400";

  // --- Render Functions ---

  const renderListView = () => {
    // Filter top-level categories from the tree structure
    // This assumes categoryTree has the structure [{ _id, name, children, ... }, ...]
    const topLevelCategories = categoryTree.filter((cat) => !cat.parent); // Assuming root nodes have no parent property or it's null/undefined

    if (topLevelCategories.length === 0 && !isFetchingCategories) {
      return (
        <p className="text-center text-subtle">
          No top-level categories found.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topLevelCategories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category._id}`}
            className={cardClass}
            title={`View posts in ${category.name}`}
          >
            <h2 className={categoryNameClass}>{category.name}</h2>
            {category.description && (
              <p className={categoryDescClass}>{category.description}</p>
            )}
            {/* Indicate if category has children */}
            {category.children && category.children.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                Contains sub-topics
              </span>
            )}
          </Link>
        ))}
      </div>
    );
  };

  const renderTreeView = () => {
    // Use categoryTree directly from CategoryContext
    if (categoryTree.length === 0 && !isFetchingCategories) {
      return (
        <p className="text-center text-subtle">
          No categories found to build the tree.
        </p>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
        <ul className="list-none p-0">
          {categoryTree.map((rootNode) => (
            // Pass node data to CategoryTreeNode
            // Ensure CategoryTreeNode ONLY uses props now, not context itself
            <CategoryTreeNode key={rootNode._id} node={rootNode} />
          ))}
        </ul>
      </div>
    );
  };

  // --- Main Return ---
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <h1 className={headingClass}>Explore Topics</h1>
      <p className={subHeadingClass}>
        Browse categories as a list or a structured tree.
      </p>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-8 space-x-2">
        <button
          onClick={() => setViewMode("list")}
          className={`${buttonBase} ${
            viewMode === "list" ? activeBtn : inactiveBtn
          }`}
          aria-pressed={viewMode === "list"}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode("tree")}
          className={`${buttonBase} ${
            viewMode === "tree" ? activeBtn : inactiveBtn
          }`}
          aria-pressed={viewMode === "tree"}
        >
          Tree View
        </button>
      </div>

      {/* Loading State */}
      {isFetchingCategories && categoryTree.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {categoryTreeError && !isFetchingCategories && (
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">
            Error Loading Categories
          </h2>
          <p className="text-error mb-6">{categoryTreeError}</p>{" "}
          {/* Show error from CategoryContext */}
          <button onClick={fetchCategoryTree} className="btn-primary">
            {" "}
            {/* Retry using CategoryContext function */}
            Retry
          </button>
        </div>
      )}

      {/* Content Area */}
      {!isFetchingCategories && !categoryTreeError && (
        <>
          {viewMode === "list" && renderListView()}
          {viewMode === "tree" && renderTreeView()}
        </>
      )}
    </div>
  );
};

export default CategoriesListPage;
