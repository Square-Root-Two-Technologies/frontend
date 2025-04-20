// src/components/CategoriesListPage/CategoriesListPage.js
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CategoryTreeNode from "../CategoryTree/CategoryTreeNode"; // Import the reusable node

const CategoriesListPage = () => {
  const {
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError,
    // We might still use flat 'categories' for the card view if derived in NoteState
    // Or derive top-level categories directly from categoryTree here
    categories,
  } = useContext(NoteContext);

  const [viewMode, setViewMode] = useState("list"); // 'list' or 'tree'

  useEffect(() => {
    // Fetch tree if not already loaded
    if (
      categoryTree.length === 0 &&
      !isFetchingCategories &&
      !categoryTreeError
    ) {
      console.log("CategoriesListPage: Triggering fetchCategoryTree");
      fetchCategoryTree();
    }
    window.scrollTo(0, 0);
  }, [
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError,
  ]); // Add error dependency

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "list" ? "tree" : "list"));
  };

  // --- Styling Classes ---
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

  // --- Render Logic ---

  const renderListView = () => {
    // Get only top-level categories for the list/card view
    const topLevelCategories = categoryTree.filter((cat) => !cat.parent);

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
            {/* Optional: Indicate if it has children */}
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
            <CategoryTreeNode key={rootNode._id} node={rootNode} />
          ))}
        </ul>
      </div>
    );
  };

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
          <p className="text-error mb-6">{categoryTreeError}</p>
          <button onClick={fetchCategoryTree} className="btn-primary">
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
