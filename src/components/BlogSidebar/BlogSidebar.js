import React, { useState, useContext, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CategoryContext from "../../context/category/CategoryContext";
import NoteContext from "../../context/Notes/NoteContext"; // Import NoteContext
import CategoryTreeNode from "../CategoryTree/CategoryTreeNode";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { FaAngleLeft, FaAngleRight, FaTree } from "react-icons/fa";

// Remove currentNote from props
const BlogSidebar = () => {
  const {
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError,
    fetchPostsForCategory, // Make sure these are provided by CategoryContext
    fetchedCategoryNotesMap,
    categoryNotesLoadingMap,
    categoryNotesErrorMap,
  } = useContext(CategoryContext);

  // Get the currently viewed single note from NoteContext
  const { note: currentNote } = useContext(NoteContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- Logic using currentNote remains the same ---
  const currentNoteId = currentNote?._id;
  const ancestorPathIds = useMemo(
    () => currentNote?.ancestorPath?.map((p) => p._id) || [],
    [currentNote?.ancestorPath],
  );
  const currentNotesDirectCategoryId = currentNote?.category?._id;
  const relevantAncestorIds = useMemo(
    () => [...ancestorPathIds, currentNotesDirectCategoryId].filter(Boolean),
    [ancestorPathIds, currentNotesDirectCategoryId],
  );
  // --- End Logic using currentNote ---

  useEffect(() => {
    if (
      categoryTree.length === 0 &&
      !isFetchingCategories &&
      !categoryTreeError
    ) {
      console.log("BlogSidebar: Triggering fetchCategoryTree");
      fetchCategoryTree();
    }
  }, [
    fetchCategoryTree,
    categoryTree.length,
    isFetchingCategories,
    categoryTreeError,
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sidebarBaseClasses =
    "relative transition-all duration-300 ease-in-out h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto scrollbar-thin bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-2";
  const sidebarOpenClasses = "w-72 py-4";
  const sidebarClosedClasses = "w-16 py-2";

  return (
    <aside
      className={`${sidebarBaseClasses} ${
        isSidebarOpen ? sidebarOpenClasses : sidebarClosedClasses
      }`}
    >
      {}
      <button
        onClick={toggleSidebar}
        className="absolute top-2 right-2 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 z-10"
        aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? <FaAngleLeft size={14} /> : <FaAngleRight size={14} />}
      </button>

      {isSidebarOpen ? (
        <div className="mt-6">
          {" "}
          {}
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-3 tracking-wider px-1 pb-1 border-b border-gray-200 dark:border-gray-700">
            {" "}
            {}
            Topics
          </h3>
          {isFetchingCategories && categoryTree.length === 0 ? (
            <div className="p-4 flex justify-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : categoryTreeError ? (
            <p className="text-xs text-error p-2">{categoryTreeError}</p>
          ) : categoryTree.length > 0 ? (
            <ul className="list-none p-0 space-y-0.5">
              {" "}
              {}
              {categoryTree.map((rootNode) => (
                <CategoryTreeNode
                  key={rootNode._id}
                  node={rootNode}
                  level={0}
                  // Pass down context data needed by the node
                  currentNoteId={currentNoteId}
                  ancestorPathIds={relevantAncestorIds}
                  fetchPostsForCategory={fetchPostsForCategory}
                  fetchedCategoryNotesMap={fetchedCategoryNotesMap}
                  categoryNotesLoadingMap={categoryNotesLoadingMap}
                  categoryNotesErrorMap={categoryNotesErrorMap}
                  linkTarget="_self" // Keep this for sidebar links
                />
              ))}
            </ul>
          ) : (
            <p className="text-xs text-subtle p-2">No topics found.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 mt-8 pt-4">
          <button
            onClick={toggleSidebar}
            title="Expand Topics Sidebar"
            className="p-2.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaTree size={20} /> {}
          </button>
          {}
        </div>
      )}
    </aside>
  );
};

// Remove propTypes for currentNote
// BlogSidebar.propTypes = { ... };

export default BlogSidebar;
