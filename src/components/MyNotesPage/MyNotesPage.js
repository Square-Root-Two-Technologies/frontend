import React, { useContext, useEffect, useState, useMemo } from "react"; // Added useState, useMemo
import { useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import CategoryContext from "../../context/category/CategoryContext"; // Added CategoryContext
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EmptyState from "../EmptySpace/EmptySpace";
import BlogCard from "../BlogCard/BlogCard";
import { toast } from "react-toastify"; // --- UI Improvement: Import toast ---

const MyNotesPage = () => {
  const {
    notes: userNotes, // Rename to avoid conflict with sorted/filtered notes
    getNotes,
    deleteNote,
    isLoading: isNotesLoading,
  } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const {
    categories: allCategories,
    getCategories,
    isFetchingCategories,
  } = useContext(CategoryContext); // Get categories
  const navigate = useNavigate();

  // --- UI Improvement Start: State for Sorting and Filtering ---
  const [sortBy, setSortBy] = useState("date_desc"); // 'date_desc', 'date_asc', 'title_asc', 'title_desc'
  const [filterCategory, setFilterCategory] = useState("All"); // 'All' or category._id
  // --- UI Improvement End ---

  useEffect(() => {
    if (!isUserLoading && currentUser) {
      console.log(
        `User loaded (Role: ${currentUser.role}). Fetching notes for 'MyNotesPage'...`,
      );
      getNotes().catch((err) =>
        console.error("Error fetching notes on MyNotesPage:", err),
      );
      // Fetch categories if needed for the filter dropdown
      if (allCategories.length === 0 && !isFetchingCategories) {
        getCategories();
      }
    } else if (!isUserLoading && !currentUser) {
      console.warn("Attempted to load MyNotesPage without logged-in user.");
    }
  }, [
    currentUser,
    isUserLoading,
    getNotes,
    allCategories.length,
    getCategories,
    isFetchingCategories,
  ]); // Added category dependencies

  // --- UI Improvement Start: Memoized Sorting and Filtering ---
  const displayedNotes = useMemo(() => {
    let filtered = userNotes;

    if (filterCategory !== "All") {
      filtered = userNotes.filter(
        (note) => note.category?._id === filterCategory,
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return (a.title || "").localeCompare(b.title || "");
        case "title_desc":
          return (b.title || "").localeCompare(a.title || "");
        case "date_asc":
          return new Date(a.date || 0) - new Date(b.date || 0);
        case "date_desc":
        default:
          return new Date(b.date || 0) - new Date(a.date || 0);
      }
    });
    return sorted;
  }, [userNotes, sortBy, filterCategory]);
  // --- UI Improvement End ---

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone.",
      )
    ) {
      deleteNote(id)
        .then(() => {
          console.log("Note deleted successfully:", id);
          toast.success("Note deleted!"); // --- UI Improvement: Added toast ---
        })
        .catch((err) => {
          console.error("Error deleting note:", err);
          toast.error("Failed to delete note."); // --- UI Improvement: Added toast ---
        });
    }
  };

  const handleEdit = (id) => {
    if (id) {
      console.log("Navigating to edit note:", id);
      navigate(`/edit-note/${id}`);
    } else {
      console.error("Cannot navigate to edit: Note ID is missing.");
      toast.error("Cannot edit this note, ID is missing."); // --- UI Improvement: Added toast ---
    }
  };

  const handleAddNote = () => {
    console.log("Navigating to add note page");
    navigate("/add-note");
  };

  const isAdminView = currentUser?.role === "admin";
  const pageTitle = isAdminView ? "Manage All Notes" : "My Notes";
  const emptyMessage = isAdminView
    ? "No notes found from any user. Add a new note to get started."
    : "You haven't created any notes yet. Click 'Add New Note' to begin!";

  const isLoading = isUserLoading || isNotesLoading; // || isFetchingCategories; // Optionally add category loading too

  // Style definitions (you might move these to a central place or keep them)
  const baseTextColor = "text-gray-900 dark:text-gray-100";
  const primaryButtonClasses = `inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out`;
  const inputFieldClasses = `px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm`; // Basic input style

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-96px)]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${baseTextColor}`}>
          {pageTitle}
        </h1>
        <button onClick={handleAddNote} className={primaryButtonClasses}>
          + Add New Note
        </button>
      </div>

      {/* --- UI Improvement Start: Sort and Filter Controls --- */}
      {!isLoading &&
        userNotes &&
        userNotes.length > 0 && ( // Only show if not loading and notes exist
          <div className="mb-6 flex gap-4 flex-wrap items-center">
            <div>
              <label htmlFor="sort-notes" className="sr-only">
                Sort Notes By
              </label>
              <select
                id="sort-notes"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`${inputFieldClasses} w-auto`}
                aria-label="Sort notes"
              >
                <option value="date_desc">Sort: Newest First</option>
                <option value="date_asc">Sort: Oldest First</option>
                <option value="title_asc">Sort: Title A-Z</option>
                <option value="title_desc">Sort: Title Z-A</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter-category" className="sr-only">
                Filter By Category
              </label>
              <select
                id="filter-category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`${inputFieldClasses} w-auto`}
                disabled={isFetchingCategories}
                aria-label="Filter notes by category"
              >
                <option value="All">Category: All</option>
                {allCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {isFetchingCategories && (
                <span className="ml-2 text-xs text-subtle">
                  Loading cats...
                </span>
              )}
            </div>
          </div>
        )}
      {/* --- UI Improvement End --- */}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoadingSpinner />
        </div>
      ) : displayedNotes && displayedNotes.length > 0 ? ( // Use the sorted/filtered list
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedNotes.map((note) => (
            <BlogCard
              key={note._id}
              note={note}
              showActions={true} // Enable Edit/Delete
              disableAnimation={true} // Keep animation disabled for management view
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdminView={isAdminView} // Pass admin flag if needed by BlogCard logic
            />
          ))}
        </div>
      ) : (
        // Show empty state based on whether filtering is active
        <EmptyState
          message={
            filterCategory !== "All" && userNotes.length > 0
              ? "No notes found in this category."
              : emptyMessage
          }
        />
      )}
    </div>
  );
};

export default MyNotesPage;
