// FILE: src/components/MyNotesPage/MyNotesPage.js
import React, { useContext, useEffect, useState, useMemo } from "react"; // Added useMemo
import { useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import CategoryContext from "../../context/category/CategoryContext"; // Import CategoryContext
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EmptyState from "../EmptySpace/EmptySpace";
import BlogCard from "../BlogCard/BlogCard";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";

const MyNotesPage = () => {
  const {
    notes: userNotes, // Rename to avoid conflict if needed, represents user's own notes or all notes for admin
    getNotes,
    deleteNote,
    isLoading: isNotesLoading, // Use the context's loading state
  } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const {
    categories: allCategories,
    getCategories,
    isFetchingCategories,
  } = useContext(CategoryContext); // Use category context
  const navigate = useNavigate();

  // State for sorting and filtering
  const [sortBy, setSortBy] = useState("date_desc"); // Default sort
  const [filterCategory, setFilterCategory] = useState("All"); // Default filter

  useEffect(() => {
    // Fetch notes only when user data is loaded and available
    if (!isUserLoading && currentUser) {
      console.log(
        `User loaded (Role: ${currentUser.role}). Fetching notes for 'MyNotesPage'...`,
      );
      getNotes().catch((err) =>
        console.error("Error fetching notes on MyNotesPage:", err),
      );
      // Fetch categories if not already loaded
      if (allCategories.length === 0 && !isFetchingCategories) {
        getCategories();
      }
    } else if (!isUserLoading && !currentUser) {
      // Handle case where user data finished loading but no user (e.g., logged out)
      console.warn("Attempted to load MyNotesPage without logged-in user.");
      // Optionally redirect to login: navigate('/login');
    }
  }, [
    currentUser,
    isUserLoading,
    getNotes,
    allCategories.length,
    getCategories,
    isFetchingCategories,
  ]); // Dependencies ensure fetch runs when user loads or category fetch state changes

  // Memoize the displayed notes based on sorting and filtering
  const displayedNotes = useMemo(() => {
    let filtered = userNotes;

    // Apply category filter
    if (filterCategory !== "All") {
      filtered = userNotes.filter(
        (note) => note.category?._id === filterCategory,
      );
    }

    // Apply sorting
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
          return new Date(b.date || 0) - new Date(a.date || 0); // Default: Newest first
      }
    });
    return sorted;
  }, [userNotes, sortBy, filterCategory]); // Recalculate when notes, sort, or filter changes

  // Delete handler with confirmation
  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone.",
      )
    ) {
      deleteNote(id)
        .then(() => {
          console.log("Note deleted successfully:", id);
          toast.success("Note deleted!"); // Show success toast
        })
        .catch((err) => {
          console.error("Error deleting note:", err);
          toast.error("Failed to delete note."); // Show error toast
        });
    }
  };

  // Edit handler
  const handleEdit = (id) => {
    if (id) {
      console.log("Navigating to edit note:", id);
      navigate(`/edit-note/${id}`);
    } else {
      console.error("Cannot navigate to edit: Note ID is missing.");
      toast.error("Cannot edit this note, ID is missing."); // Inform user
    }
  };

  // Add Note handler
  const handleAddNote = () => {
    console.log("Navigating to add note page");
    navigate("/add-note");
  };

  // --- MODIFICATION START ---
  // Determine if the view is for an admin/SuperAdmin
  const isAdminOrSuperAdminView = useMemo(() => {
    const allowedRoles = ["admin", "SuperAdmin"];
    return allowedRoles.includes(currentUser?.role);
  }, [currentUser?.role]);
  // --- MODIFICATION END ---

  // Dynamic page title and empty state message
  const pageTitle = isAdminOrSuperAdminView ? "Manage All Notes" : "My Notes";
  const emptyMessage = isAdminOrSuperAdminView
    ? "No notes found from any user. Add a new note to get started."
    : "You haven't created any notes yet. Click 'Add New Note' to begin!";

  // Combined loading state
  const isLoading = isUserLoading || isNotesLoading; // Consider both user and notes loading

  // CSS Classes
  const baseTextColor = "text-gray-900 dark:text-gray-100";
  const primaryButtonClasses = `inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out`;
  const inputFieldClasses = `px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm`; // Consistent input style

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-96px)]">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${baseTextColor}`}>
          {pageTitle}
        </h1>
        <button onClick={handleAddNote} className={primaryButtonClasses}>
          + Add New Note
        </button>
      </div>

      {/* Sorting and Filtering Controls (only show if not loading and notes exist) */}
      {!isLoading &&
        userNotes &&
        userNotes.length > 0 && ( // Check userNotes directly before filtering/sorting
          <div className="mb-6 flex gap-4 flex-wrap items-center">
            {/* Sort Dropdown */}
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
            {/* Category Filter Dropdown */}
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

      {/* Notes Display Area */}
      {isLoading ? (
        // Loading State
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoadingSpinner />
        </div>
      ) : displayedNotes && displayedNotes.length > 0 ? (
        // Notes Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedNotes.map((note) => (
            <BlogCard
              key={note._id}
              note={note}
              showActions={true} // Always show actions on this page
              disableAnimation={true} // Keep animations off for management view
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdminView={isAdminOrSuperAdminView} // Pass admin status to card if needed
            />
          ))}
        </div>
      ) : (
        // Empty State
        <EmptyState
          message={
            // Show specific message if filtering resulted in no notes
            filterCategory !== "All" && userNotes.length > 0
              ? "No notes found in this category."
              : emptyMessage // Otherwise show the general empty message
          }
        />
      )}
      {/* Toast Container for notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default MyNotesPage;
