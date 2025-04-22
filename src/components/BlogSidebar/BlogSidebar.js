import React, { useContext, useMemo, useEffect } from "react"; // Added useEffect
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CategoryContext from "../../context/category/CategoryContext";
import NoteContext from "../../context/Notes/NoteContext";
import CategoryTreeNode from "../CategoryTree/CategoryTreeNode";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { FaAngleLeft, FaAngleRight, FaTree } from "react-icons/fa";

const BlogSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  // Accepts props
  const {
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories,
    categoryTreeError,
    fetchPostsForCategory,
    fetchedCategoryNotesMap,
    categoryNotesLoadingMap,
    categoryNotesErrorMap,
  } = useContext(CategoryContext);
  const { note: currentNote } = useContext(NoteContext);

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

  // Fetching logic (remains the same, triggered by parent or here)
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

  // Base classes + Desktop conditional width + Desktop transition
  const sidebarClasses = `
    h-full overflow-y-auto scrollbar-thin
    bg-gray-50 dark:bg-gray-800
    border-r border-gray-200 dark:border-gray-700
    relative  /* Needed for absolute positioning of desktop toggle */
    lg:transition-[width] lg:duration-300 lg:ease-in-out /* Desktop width transition */
    ${
      isSidebarOpen ? "lg:w-72 px-2 py-4" : "lg:w-16 px-2 py-2"
    } /* Desktop width and padding */
    w-full /* Mobile width handled by parent wrapper */
    ${isSidebarOpen ? "p-4" : "p-2"} /* Mobile padding */
  `;

  return (
    // This aside handles internal content and DESKTOP width transition
    <aside className={sidebarClasses}>
      {/* --- DESKTOP Toggle Button --- */}
      {/* Positioned absolutely within the sidebar, only visible on desktop */}
      <button
        onClick={toggleSidebar} // Use prop function
        className="absolute top-2 right-2 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 z-10 hidden lg:block" // hidden lg:block
        aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? <FaAngleLeft size={14} /> : <FaAngleRight size={14} />}
      </button>

      {/* Content rendering based on isSidebarOpen prop */}
      {isSidebarOpen ? (
        // --- Full Content (Visible when open on both mobile/desktop) ---
        <div className="mt-6">
          {" "}
          {/* Standard margin for open view */}
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-3 tracking-wider px-1 pb-1 border-b border-gray-200 dark:border-gray-700">
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
              {categoryTree.map((rootNode) => (
                <CategoryTreeNode
                  key={rootNode._id}
                  node={rootNode}
                  level={0}
                  currentNoteId={currentNoteId}
                  ancestorPathIds={relevantAncestorIds}
                  fetchPostsForCategory={fetchPostsForCategory}
                  fetchedCategoryNotesMap={fetchedCategoryNotesMap}
                  categoryNotesLoadingMap={categoryNotesLoadingMap}
                  categoryNotesErrorMap={categoryNotesErrorMap}
                  linkTarget="_self"
                />
              ))}
            </ul>
          ) : (
            <p className="text-xs text-subtle p-2">No topics found.</p>
          )}
        </div>
      ) : (
        // --- Collapsed Content (Icon only, visible when collapsed on both mobile/desktop) ---
        <div className="flex flex-col items-center space-y-4 mt-8 pt-4">
          {/* On desktop, the main toggle is hidden, this acts as placeholder */}
          {/* On mobile, the main toggle is handled by parent */}
          <FaTree
            size={20}
            className="text-gray-600 dark:text-gray-300 lg:hidden"
          />{" "}
          {/* Show tree icon only on mobile collapsed */}
          <span className="hidden lg:block h-8"></span>{" "}
          {/* Placeholder height for desktop collapsed */}
        </div>
      )}
    </aside>
  );
};

BlogSidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default BlogSidebar;
