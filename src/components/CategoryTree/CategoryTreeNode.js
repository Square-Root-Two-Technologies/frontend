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
  currentNoteId,
  ancestorPathIds = [],
  fetchPostsForCategory,
  fetchedCategoryNotesMap = {},
  categoryNotesLoadingMap = {},
  categoryNotesErrorMap = {},
}) => {
  const navigate = useNavigate();

  // --- MOVE HOOKS HERE ---
  const nodeId = node?._id; // Safely access _id after checking node
  const hasChildren = node?.children && node.children.length > 0;
  const canHavePosts = !!fetchPostsForCategory;
  const shouldBeOpenInitially = nodeId
    ? ancestorPathIds.includes(nodeId)
    : false; // Check nodeId exists

  const [isOpen, setIsOpen] = useState(shouldBeOpenInitially);
  const notesForThisNode = nodeId ? fetchedCategoryNotesMap[nodeId] || [] : [];
  const currentIsLoadingNotes = nodeId
    ? categoryNotesLoadingMap[nodeId] || false
    : false;
  const currentErrorLoadingNotes = nodeId
    ? categoryNotesErrorMap[nodeId] || null
    : null;
  const currentHasFetchedNotes = nodeId
    ? fetchedCategoryNotesMap.hasOwnProperty(nodeId) ||
      categoryNotesErrorMap.hasOwnProperty(nodeId)
    : false;

  const toggleOpen = useCallback((e) => {
    e?.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []); // Dependency array is empty as it doesn't depend on external variables

  useEffect(() => {
    if (!nodeId) return; // Don't run effect if nodeId is invalid
    const shouldBeOpenBasedOnProps = ancestorPathIds.includes(nodeId);
    // Removed console log for brevity, can be added back if needed for debugging
    // console.log(`Node ${node.name} (${nodeId}): currentNoteId=${currentNoteId}, ancestors=${ancestorPathIds}, shouldBeOpen=${shouldBeOpenBasedOnProps}, currentIsOpen=${isOpen}`);
    setIsOpen(shouldBeOpenBasedOnProps);
  }, [currentNoteId, ancestorPathIds, nodeId]); // Removed node.name, node from deps as nodeId covers uniqueness

  useEffect(() => {
    if (!nodeId) return; // Don't run effect if nodeId is invalid
    const shouldFetch =
      isOpen &&
      canHavePosts &&
      !currentHasFetchedNotes &&
      !currentIsLoadingNotes &&
      fetchPostsForCategory;
    if (shouldFetch) {
      // Removed console log for brevity
      // console.log(`Node '${node.name}' (${nodeId}) is open and needs data, triggering fetch...`);
      fetchPostsForCategory(nodeId);
    }
  }, [
    isOpen,
    canHavePosts,
    currentHasFetchedNotes,
    currentIsLoadingNotes,
    fetchPostsForCategory,
    nodeId, // Use nodeId instead of node.name
    // node.name, // Removed: node.name dependency not strictly needed if logic relies on nodeId
  ]);
  // --- END OF MOVED HOOKS ---

  // Early return check NOW comes after hooks
  if (!node || !node._id) {
    console.warn("CategoryTreeNode rendered with invalid node:", node);
    return null;
  }

  // ... rest of the component logic remains the same ...

  const handleCategoryClick = (e) => {
    e.preventDefault();
    if (linkTarget !== "_self") {
      navigate(`/category/${node._id}`);
    } else {
      toggleOpen(e); // toggleOpen is now defined above
    }
  };

  const isAncestorOfCurrentNote = ancestorPathIds.includes(nodeId);

  // Class definitions (no changes needed here)
  const nodeContainerClasses = "py-0.5";
  const nodeContentClasses = `flex items-center group rounded px-1.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150 ease-in-out ${
    isAncestorOfCurrentNote
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

  // JSX return (no changes needed here, assuming logic inside uses hooks correctly defined above)
  return (
    <li className={nodeContainerClasses}>
      <div className={nodeContentClasses}>
        {/* Toggle Button */}
        {hasChildren || canHavePosts ? (
          <button
            onClick={toggleOpen}
            className={toggleButtonClasses}
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
          <span className="inline-block w-[22px] mr-1.5 flex-shrink-0"></span> // Placeholder for alignment
        )}

        {/* Folder Icon */}
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
          onClick={handleCategoryClick}
          className={categoryLinkClasses}
          title={node.description || `View category: ${node.name}`}
        >
          {node.name}
        </a>
      </div>

      {/* Children and Posts */}
      {isOpen && (
        <div className="mt-0.5">
          {/* Render Children */}
          {hasChildren && (
            <ul className={subCategoryListClasses}>
              {node.children.map((child) => (
                <CategoryTreeNode
                  key={child._id}
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

          {/* Render Posts */}
          {canHavePosts && (
            <ul className={noteListClasses}>
              {/* Loading State */}
              {currentIsLoadingNotes && (
                <li className="py-1 flex items-center text-xs text-subtle px-1">
                  <LoadingSpinner size="sm" />
                  <span className="ml-1.5">Loading posts...</span>
                </li>
              )}

              {/* Error State */}
              {currentErrorLoadingNotes && (
                <li className="py-1 text-xs text-error px-1 italic">
                  Error: {currentErrorLoadingNotes}
                </li>
              )}

              {/* Posts List */}
              {!currentIsLoadingNotes &&
                !currentErrorLoadingNotes &&
                currentHasFetchedNotes &&
                notesForThisNode.length > 0 &&
                notesForThisNode.map((noteInList) => {
                  if (!noteInList || !noteInList._id || !noteInList.slug) {
                    // console.warn( `[TreeNode Skipping Invalid Post] Node: ${node.name}`, noteInList); // Optional: keep for debugging
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
                        onClick={(e) => e.stopPropagation()} // Prevent collapsing parent when clicking post
                      >
                        {noteInList.title || "Untitled Post"}
                      </Link>
                    </li>
                  );
                })}

              {/* No Posts State */}
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

// PropTypes remain the same
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

// DefaultProps remain the same
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

export default CategoryTreeNode;
