// FILE: src/components/BlogSidebar/BlogSidebar.js
import React, { useState, useContext, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import CategoryTreeNode from "../CategoryTree/CategoryTreeNode";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { FaAngleLeft, FaAngleRight, FaListUl, FaTree } from "react-icons/fa"; // Example icons

const BlogSidebar = ({ currentNote }) => {
  const {
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError,
    categoryNotesList,
    fetchAllNotesByCategory,
    isFetchingCategoryNotesList,
    categoryNotesListError,
  } = useContext(NoteContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop

  const currentCategoryId = currentNote?.category?._id;
  const currentNoteId = currentNote?._id;
  const ancestorPathIds = useMemo(
    () => currentNote?.ancestorPath?.map((p) => p._id) || [],
    [currentNote?.ancestorPath],
  );

  useEffect(() => {
    // Fetch category notes list when the category changes
    if (currentCategoryId) {
      console.log(
        `BlogSidebar: Fetching notes for category ${currentCategoryId}`,
      );
      fetchAllNotesByCategory(currentCategoryId);
    }
    // Fetch category tree if it's not available
    if (
      categoryTree.length === 0 &&
      !isFetchingCategories &&
      !categoryTreeError
    ) {
      console.log("BlogSidebar: Triggering fetchCategoryTree");
      fetchCategoryTree();
    }
  }, [
    currentCategoryId,
    fetchAllNotesByCategory,
    fetchCategoryTree,
    categoryTree.length,
    isFetchingCategories,
    categoryTreeError,
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Basic styling - needs refinement to match Salesforce Help
  const sidebarBaseClasses =
    "transition-all duration-300 ease-in-out h-screen sticky top-16 overflow-y-auto scrollbar-thin bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700";
  const sidebarOpenClasses = "w-72 p-4";
  const sidebarClosedClasses = "w-16 p-2"; // Adjust for icons when closed

  const itemLinkClasses = `block px-2 py-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700`;
  const activeItemLinkClasses = `bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold`;
  const inactiveItemLinkClasses = `text-neutral dark:text-gray-300`;

  return (
    <aside
      className={`${sidebarBaseClasses} ${
        isSidebarOpen ? sidebarOpenClasses : sidebarClosedClasses
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
      </button>

      {isSidebarOpen ? (
        // --- Expanded View ---
        <div className="mt-8">
          {/* Category Tree Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wider">
              Topics
            </h3>
            {isFetchingCategories && categoryTree.length === 0 ? (
              <LoadingSpinner />
            ) : categoryTreeError ? (
              <p className="text-xs text-error">{categoryTreeError}</p>
            ) : categoryTree.length > 0 ? (
              <ul className="list-none p-0">
                {categoryTree.map((rootNode) => (
                  <CategoryTreeNode
                    key={rootNode._id}
                    node={rootNode}
                    level={0}
                    currentNodeId={currentCategoryId} // Pass current category ID
                    ancestorPathIds={ancestorPathIds} // Pass ancestor IDs
                  />
                ))}
              </ul>
            ) : (
              <p className="text-xs text-subtle">No topics found.</p>
            )}
          </div>

          {/* Related Posts Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wider">
              In this Category
            </h3>
            {isFetchingCategoryNotesList ? (
              <LoadingSpinner />
            ) : categoryNotesListError ? (
              <p className="text-xs text-error">{categoryNotesListError}</p>
            ) : categoryNotesList.length > 0 ? (
              <ul className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin pr-1">
                {" "}
                {/* Limit height and make scrollable */}
                {categoryNotesList.map((note) => (
                  <li key={note._id}>
                    <Link
                      to={`/blog/${note.slug}`}
                      title={note.title}
                      className={`${itemLinkClasses} ${
                        note._id === currentNoteId
                          ? activeItemLinkClasses
                          : inactiveItemLinkClasses
                      } truncate`} // Truncate long titles
                    >
                      {note.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-subtle">
                No other posts in this category.
              </p>
            )}
          </div>
        </div>
      ) : (
        // --- Collapsed View ---
        <div className="flex flex-col items-center space-y-4 mt-8">
          <button
            onClick={toggleSidebar}
            title="Topics"
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaTree />
          </button>
          <button
            onClick={toggleSidebar}
            title="Related Posts"
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaListUl />
          </button>
          {/* Add more icons as needed */}
        </div>
      )}
    </aside>
  );
};

BlogSidebar.propTypes = {
  currentNote: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    category: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
    }),
    ancestorPath: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
      }),
    ),
  }),
};

export default BlogSidebar;
