import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaChevronDown,
  FaChevronRight,
  FaFileAlt,
  FaFolder,
  FaFolderOpen,
} from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const CategoryTreeNode = ({
  node,
  level = 0,
  linkTarget = "_self",
  currentNoteId, // ID of the currently viewed note
  ancestorPathIds = [], // Array of IDs for the current note's ancestors + direct parent
  fetchPostsForCategory,
  fetchedCategoryNotesMap = {},
  categoryNotesLoadingMap = {},
  categoryNotesErrorMap = {},
}) => {
  const navigate = useNavigate();

  if (!node || !node._id) {
    console.warn("CategoryTreeNode rendered with invalid node:", node);
    return null;
  }

  const nodeId = node._id;
  const hasChildren = node.children && node.children.length > 0;
  const canHavePosts = !!fetchPostsForCategory;

  // Initial state determination (still useful for the very first load)
  const shouldBeOpenInitially = ancestorPathIds.includes(nodeId);
  const [isOpen, setIsOpen] = useState(shouldBeOpenInitially);

  // --- START: Added useEffect to synchronize state with props ---
  useEffect(() => {
    // This effect runs when the component mounts AND whenever
    // currentNoteId or ancestorPathIds change.
    // It ensures the open state reflects the *current* active path.
    const shouldBeOpenBasedOnProps = ancestorPathIds.includes(nodeId);
    console.log(
      `Node ${node.name} (${nodeId}): currentNoteId=${currentNoteId}, ancestors=${ancestorPathIds}, shouldBeOpen=${shouldBeOpenBasedOnProps}, currentIsOpen=${isOpen}`,
    );
    setIsOpen(shouldBeOpenBasedOnProps);
  }, [currentNoteId, ancestorPathIds, nodeId]); // Re-evaluate when the viewed note changes
  // --- END: Added useEffect ---

  const notesForThisNode = fetchedCategoryNotesMap[nodeId] || [];
  const currentIsLoadingNotes = categoryNotesLoadingMap[nodeId] || false;
  const currentErrorLoadingNotes = categoryNotesErrorMap[nodeId] || null;
  const currentHasFetchedNotes =
    fetchedCategoryNotesMap.hasOwnProperty(nodeId) ||
    categoryNotesErrorMap.hasOwnProperty(nodeId);

  // User-initiated toggle function
  const toggleOpen = useCallback((e) => {
    e?.stopPropagation();
    setIsOpen((prev) => !prev); // Just toggle the current state
  }, []);

  // Effect to fetch posts when a node is opened (if needed) - Keep this as is
  useEffect(() => {
    const shouldFetch =
      isOpen &&
      canHavePosts &&
      !currentHasFetchedNotes &&
      !currentIsLoadingNotes &&
      fetchPostsForCategory;

    if (shouldFetch) {
      console.log(
        `Node '${node.name}' (${nodeId}) is open and needs data, triggering fetch...`,
      );
      fetchPostsForCategory(nodeId);
    }
  }, [
    isOpen, // Now depends on the potentially updated state
    canHavePosts,
    currentHasFetchedNotes,
    currentIsLoadingNotes,
    fetchPostsForCategory,
    nodeId,
    node.name,
  ]);

  // Handle clicks on the category name itself
  const handleCategoryClick = (e) => {
    e.preventDefault();
    if (linkTarget !== "_self") {
      navigate(`/category/${node._id}`);
    } else {
      // In sidebar, clicking the category name should toggle it
      toggleOpen(e);
    }
  };

  // Styling Classes (use isOpen state which is now synchronized)
  const isAncestorOfCurrentNote = ancestorPathIds.includes(nodeId); // Keep for styling
  const nodeContainerClasses = "py-0.5";
  const nodeContentClasses = `flex items-center group rounded px-1.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150 ease-in-out ${
    isAncestorOfCurrentNote // Style based on ancestry prop, not necessarily the 'isOpen' state
      ? "bg-blue-50 dark:bg-blue-900/30 font-semibold"
      : ""
  }`;
  const toggleButtonClasses =
    "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none p-1 mr-1.5 flex-shrink-0";
  const categoryIconClasses =
    "mr-1.5 text-amber-500 dark:text-amber-400 flex-shrink-0";
  const categoryLinkClasses = `text-sm font-medium transition-colors duration-150 ease-in-out cursor-pointer flex-grow truncate ${
    isAncestorOfCurrentNote
      ? "text-primary dark:text-blue-400"
      : "text-neutral dark:text-gray-300 group-hover:text-primary dark:group-hover:text-blue-400"
  }`;
  const subListBaseClasses = "ml-[14px] pl-4 border-l";
  const subCategoryListClasses = `${subListBaseClasses} border-dashed border-gray-300 dark:border-gray-600`;
  const noteListClasses = `${subListBaseClasses} border-dotted border-gray-400 dark:border-gray-500 mt-1 space-y-0.5`;
  const postLinkBaseClasses =
    "text-xs transition-colors duration-150 ease-in-out inline-block py-0.5 px-1 rounded truncate max-w-[95%]";
  const postLinkInactiveClasses =
    "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50";
  const postLinkActiveClasses =
    "text-blue-700 dark:text-blue-300 font-semibold bg-blue-100 dark:bg-blue-900/40";

  // --- Render logic uses the 'isOpen' state ---
  return (
    <li className={nodeContainerClasses}>
      <div className={nodeContentClasses}>
        {/* Toggle Arrow */}
        {hasChildren || canHavePosts ? (
          <button
            onClick={toggleOpen} // User click toggles state
            className={toggleButtonClasses}
            aria-expanded={isOpen} // Reflects current state
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
          <span className="inline-block w-[22px] mr-1.5 flex-shrink-0"></span>
        )}

        {/* Category Icon */}
        <span className={categoryIconClasses}>
          {isOpen &&
          (hasChildren ||
            (canHavePosts &&
              (notesForThisNode.length > 0 || currentIsLoadingNotes))) ? (
            <FaFolderOpen size={14} />
          ) : (
            <FaFolder size={14} />
          )}
        </span>

        {/* Category Link/Name */}
        <a
          href={linkTarget === "_self" ? "#" : `/category/${node._id}`}
          onClick={handleCategoryClick} // Handles toggle/navigate
          className={categoryLinkClasses}
          title={node.description || `View category: ${node.name}`}
        >
          {node.name}
        </a>
      </div>

      {/* Children and Posts - Render based on 'isOpen' state */}
      {isOpen && (
        <div className="mt-0.5">
          {/* Sub-categories */}
          {hasChildren && (
            <ul className={subCategoryListClasses}>
              {node.children.map((child) => (
                <CategoryTreeNode
                  key={child._id} // Key is important for React updates
                  node={child}
                  level={level + 1}
                  linkTarget={linkTarget}
                  currentNoteId={currentNoteId}
                  ancestorPathIds={ancestorPathIds}
                  fetchPostsForCategory={fetchPostsForCategory}
                  fetchedCategoryNotesMap={fetchedCategoryNotesMap}
                  categoryNotesLoadingMap={categoryNotesLoadingMap}
                  categoryNotesErrorMap={categoryNotesErrorMap}
                />
              ))}
            </ul>
          )}

          {/* Posts within this category */}
          {canHavePosts && (
            <ul className={noteListClasses}>
              {/* Loading Indicator */}
              {currentIsLoadingNotes && (
                <li className="py-1 flex items-center text-xs text-subtle px-1">
                  <LoadingSpinner size="sm" />
                  <span className="ml-1.5">Loading posts...</span>
                </li>
              )}
              {/* Error Message */}
              {currentErrorLoadingNotes && (
                <li className="py-1 text-xs text-error px-1 italic">
                  Error: {currentErrorLoadingNotes}
                </li>
              )}
              {/* Display Posts */}
              {!currentIsLoadingNotes &&
                !currentErrorLoadingNotes &&
                currentHasFetchedNotes &&
                notesForThisNode.length > 0 &&
                notesForThisNode.map((noteInList) => {
                  if (!noteInList || !noteInList._id || !noteInList.slug) {
                    console.warn(
                      `[TreeNode Skipping Invalid Post] Node: ${node.name}`,
                      noteInList,
                    );
                    return null;
                  }
                  const isCurrent = noteInList._id === currentNoteId;
                  return (
                    <li
                      key={noteInList._id}
                      className="flex items-center gap-1 group/post"
                    >
                      <FaFileAlt
                        className={`text-gray-400 dark:text-gray-500 flex-shrink-0 ${
                          isCurrent
                            ? "text-blue-500 dark:text-blue-400"
                            : "group-hover/post:text-primary dark:group-hover/post:text-blue-400"
                        }`}
                        size={10}
                      />
                      <Link
                        to={
                          linkTarget === "_self"
                            ? `/blog/${noteInList.slug}`
                            : `/categories/blog/${noteInList.slug}`
                        }
                        target={linkTarget}
                        title={noteInList.title || "Untitled Post"}
                        className={`${postLinkBaseClasses} ${
                          isCurrent
                            ? postLinkActiveClasses
                            : postLinkInactiveClasses
                        }`}
                        aria-current={isCurrent ? "page" : undefined}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {noteInList.title || "Untitled Post"}
                      </Link>
                    </li>
                  );
                })}
              {/* No Posts Message */}
              {!currentIsLoadingNotes &&
                !currentErrorLoadingNotes &&
                currentHasFetchedNotes &&
                notesForThisNode.length === 0 && (
                  <li className="py-1 text-xs text-subtle px-1 italic">
                    No posts in this topic.
                  </li>
                )}
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

// PropTypes and DefaultProps remain the same as in the previous attempt
CategoryTreeNode.propTypes = {
  node: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    children: PropTypes.array,
    parent: PropTypes.string,
  }).isRequired,
  level: PropTypes.number,
  linkTarget: PropTypes.string,
  currentNoteId: PropTypes.string,
  ancestorPathIds: PropTypes.arrayOf(PropTypes.string),
  fetchPostsForCategory: PropTypes.func,
  fetchedCategoryNotesMap: PropTypes.object,
  categoryNotesLoadingMap: PropTypes.object,
  categoryNotesErrorMap: PropTypes.object,
};

CategoryTreeNode.defaultProps = {
  level: 0,
  linkTarget: "_self",
  currentNoteId: null,
  ancestorPathIds: [],
  fetchPostsForCategory: undefined,
  fetchedCategoryNotesMap: {},
  categoryNotesLoadingMap: {},
  categoryNotesErrorMap: {},
};

export default CategoryTreeNode; // Consider React.memo if performance becomes an issue
