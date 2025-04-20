import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EmptyState from "../EmptySpace/EmptySpace";
import BlogCard from "../BlogCard/BlogCard"; // <-- Import the modified BlogCard

// MyNoteCard component definition is REMOVED from this file

const MyNotesPage = () => {
  const {
    notes,
    getNotes,
    deleteNote,
    isLoading: isNotesLoading,
  } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch notes on component mount or when user changes
  useEffect(() => {
    if (!isUserLoading && currentUser) {
      console.log(
        `User loaded (Role: ${currentUser.role}). Fetching notes for 'MyNotesPage'...`,
      );
      getNotes().catch((err) =>
        console.error("Error fetching notes on MyNotesPage:", err),
      );
    } else if (!isUserLoading && !currentUser) {
      console.warn("Attempted to load MyNotesPage without logged-in user.");
      // Consider redirecting to login if needed
    }
  }, [currentUser, isUserLoading, getNotes]);

  // Delete handler
  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone.",
      )
    ) {
      deleteNote(id)
        .then(() => {
          console.log("Note deleted successfully:", id);
          // Optional: Show a success notification to the user
        })
        .catch((err) => {
          console.error("Error deleting note:", err);
          // Optional: Show an error notification to the user
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
      alert("Cannot edit this note, ID is missing.");
    }
  };

  // Add Note handler
  const handleAddNote = () => {
    console.log("Navigating to add note page");
    navigate("/add-note");
  };

  const isAdminView = currentUser?.role === "admin";
  const pageTitle = isAdminView ? "Manage All Notes" : "My Notes";
  const emptyMessage = isAdminView
    ? "No notes found from any user. Add a new note to get started."
    : "You haven't created any notes yet. Click 'Add New Note' to begin!";
  const isLoading = isUserLoading || isNotesLoading;
  const baseTextColor = "text-gray-900 dark:text-gray-100";
  const primaryButtonClasses = `inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out`;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-96px)]">
      {" "}
      {/* Added min-height */}
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${baseTextColor}`}>
          {pageTitle}
        </h1>
        <button onClick={handleAddNote} className={primaryButtonClasses}>
          + Add New Note
        </button>
      </div>
      {/* Content Area */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoadingSpinner />
        </div>
      ) : notes && notes.length > 0 ? (
        // Grid using the modified BlogCard
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <BlogCard
              key={note._id}
              note={note}
              showActions={true} // <-- Enable Edit/Delete buttons
              disableAnimation={true} // <-- Disable the header animation
              onEdit={handleEdit} // <-- Pass the edit handler
              onDelete={handleDelete} // <-- Pass the delete handler
              isAdminView={isAdminView} // Pass admin status if needed
            />
          ))}
        </div>
      ) : (
        // Empty state if no notes
        <EmptyState message={emptyMessage} />
      )}
    </div>
  );
};

export default MyNotesPage;
