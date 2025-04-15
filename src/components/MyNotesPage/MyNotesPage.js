// FILE: src/components/MyNotesPage/MyNotesPage.js
import React, { useContext, useEffect } from "react"; // Removed useState if not used locally
import { useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext"; // <-- Import UserContext
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EmptyState from "../EmptySpace/EmptySpace"; // Assuming this component exists

// --- MyNoteCard Sub-Component (Modified for Admin View) ---
const MyNoteCard = ({ note, onDelete, onEdit, isAdminView }) => {
  // Destructure note properties, including user object
  const { title, description, date, _id, tag, type, user } = note;

  // Format date
  const postDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Extract author name (handle potential missing user)
  const authorName = user?.name || "Unknown Author";

  // Define reusable style classes (or use global ones from index.css)
  const baseTextColor = "text-gray-800 dark:text-gray-200";
  const subtleTextColor = "text-gray-500 dark:text-gray-400";
  const cardBg = "bg-white dark:bg-gray-900";
  const cardBorder = "border border-gray-200 dark:border-gray-700";
  const buttonBase =
    "px-3 py-1 text-xs font-medium rounded transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const editButton = `${buttonBase} bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 focus:ring-blue-500`;
  const deleteButton = `${buttonBase} bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 focus:ring-red-500`;
  const authorInfoClass = `text-xs font-medium ${subtleTextColor} mb-1 italic`; // Style for author line

  return (
    <div
      className={`p-4 md:p-5 ${cardBg} ${cardBorder} rounded-lg shadow-md flex flex-col`}
    >
      {/* --- Conditionally display author information for admin --- */}
      {isAdminView && user && (
        <p className={authorInfoClass}>
          Author:{" "}
          <span className="font-semibold not-italic text-gray-600 dark:text-gray-300">
            {authorName}
          </span>
        </p>
      )}
      {/* --- End conditional author display --- */}

      <h3
        className={`text-lg font-semibold ${baseTextColor} mb-1 line-clamp-2`}
      >
        {title}
      </h3>
      <p className={`text-xs ${subtleTextColor} mb-2`}>{postDate}</p>
      <p
        className={`text-sm ${baseTextColor} overflow-hidden overflow-ellipsis line-clamp-3 h-[60px] mb-3 flex-grow`}
      >
        {description}
      </p>
      {(type || tag) && (
        <span
          className={`self-start inline-block mb-3 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full`}
        >
          {type || tag}
        </span>
      )}
      {/* Action buttons at the bottom */}
      <div className="mt-auto pt-3 flex justify-end space-x-2 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onEdit(_id)}
          className={editButton}
          aria-label={`Edit note titled ${title}`}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(_id)}
          className={deleteButton}
          aria-label={`Delete note titled ${title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
// --- End MyNoteCard Sub-Component ---

// --- Main MyNotesPage Component ---
const MyNotesPage = () => {
  // Get notes state and functions from NoteContext
  // Use isNotesLoading alias to avoid conflict with isUserLoading
  const {
    notes,
    getNotes,
    deleteNote,
    isLoading: isNotesLoading,
  } = useContext(NoteContext);
  // Get user state from UserContext
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();

  // Effect to fetch notes when the user is loaded
  useEffect(() => {
    // Only fetch if user loading is finished and user is logged in
    if (!isUserLoading && currentUser) {
      console.log(
        `User loaded (Role: ${currentUser.role}). Fetching notes for 'MyNotesPage'...`,
      );
      getNotes() // Call getNotes from context (backend handles role logic)
        .catch((err) => console.error("Error fetching notes:", err));
    } else if (!isUserLoading && !currentUser) {
      // User is not logged in - ProtectedRoute should prevent this page view
      console.warn("Attempted to load MyNotesPage without logged-in user.");
      // Optionally redirect: navigate('/login');
    }
    // If isUserLoading is true, the effect will run again when it becomes false
  }, [currentUser, isUserLoading, getNotes]); // Dependencies: run when user state changes or getNotes function reference changes

  // Handler for deleting a note
  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone.",
      )
    ) {
      deleteNote(id)
        .then(() => {
          console.log("Note deleted successfully:", id);
          // Optionally show a success notification
        })
        .catch((err) => {
          console.error("Error deleting note:", err);
          // Optionally show an error notification
        });
    }
  };

  // Handler for navigating to the edit page
  const handleEdit = (id) => {
    console.log("Navigating to edit note:", id);
    navigate(`/edit-note/${id}`);
  };

  // Handler for navigating to the add note page
  const handleAddNote = () => {
    console.log("Navigating to add note page");
    navigate("/add-note");
  };

  // --- Determine view specifics based on user role ---
  const isAdminView = currentUser?.role === "admin";
  const pageTitle = isAdminView ? "Manage All Notes" : "My Notes";
  const emptyMessage = isAdminView
    ? "No notes found from any user. Add a new note to get started."
    : "You haven't created any notes yet. Click 'Add New Note' to begin!";
  // --- End role-specific determination ---

  // Combined loading state: Show loading if user OR notes are loading
  const isLoading = isUserLoading || isNotesLoading;

  // --- Reusable style classes ---
  const baseTextColor = "text-gray-900 dark:text-gray-100"; // Or use global definition
  const primaryButtonClasses = `inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out`; // Or use global definition
  // --- End styles ---

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${baseTextColor}`}>
          {pageTitle} {/* Dynamic page title */}
        </h1>
        <button onClick={handleAddNote} className={primaryButtonClasses}>
          + Add New Note
        </button>
      </div>

      {/* Conditional Content: Loading, Notes Grid, or Empty State */}
      {isLoading ? (
        // Loading indicator
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoadingSpinner />
        </div>
      ) : notes && notes.length > 0 ? (
        // Grid display for notes
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map through the notes and render a card for each */}
          {notes.map((note) => (
            <MyNoteCard
              key={note._id} // Essential for list rendering
              note={note} // Pass the full note object
              onDelete={handleDelete} // Pass delete handler
              onEdit={handleEdit} // Pass edit handler
              isAdminView={isAdminView} // Pass the admin flag to the card
            />
          ))}
        </div>
      ) : (
        // Empty state message when no notes are found
        <EmptyState message={emptyMessage} /> // Dynamic empty state message
      )}
    </div>
  );
};

export default MyNotesPage;
