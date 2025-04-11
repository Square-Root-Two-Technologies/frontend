// FILE: src/components/EditNote/EditNote.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import NoteContext from "../../context/notes/NoteContext";
import UserContext from "../../context/user/UserContext"; // <-- Import UserContext
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

// List of valid note types
const noteTypes = [
  "JavaScript",
  "Salesforce",
  "Sociology",
  "Life",
  "Technology",
  "Creative",
  "Tutorial",
  "News",
];

const EditNote = () => {
  // Context Hooks
  const {
    notes,
    editNote,
    getNotes,
    isLoading: isNotesLoading,
  } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext); // <-- Get user context

  // Router Hooks
  const navigate = useNavigate();
  const { id } = useParams(); // Get note ID from URL

  // Component State
  const [note, setNote] = useState({
    // State to hold the note being edited
    title: "",
    description: "",
    tag: "",
    type: "",
    isFeatured: false, // Keep isFeatured in state for the form
    readTimeMinutes: "", // To display if available, backend recalculates on description change
  });
  const [error, setError] = useState(""); // For form errors
  const [isComponentLoading, setIsComponentLoading] = useState(true); // Loading state for finding/fetching the specific note
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission

  // Effect to load the specific note data when component mounts or ID changes
  useEffect(() => {
    // Don't proceed until user context is loaded
    if (isUserLoading) {
      setIsComponentLoading(true);
      return;
    }

    // If user is not logged in (shouldn't happen due to ProtectedRoute, but safe check)
    if (!currentUser) {
      setError("Authentication required to edit notes.");
      setIsComponentLoading(false);
      return;
    }

    setIsComponentLoading(true); // Start loading indicator for the note itself
    setError(""); // Clear previous errors

    // Function to find and set the note state
    const findAndSetNote = (notesArray) => {
      const noteToEdit = notesArray.find((n) => n._id === id);
      if (noteToEdit) {
        // Ensure we have access (owner or admin) - redundant? Backend enforces, but good practice
        if (
          noteToEdit.user._id === currentUser._id ||
          currentUser.role === "admin"
        ) {
          setNote({
            title: noteToEdit.title || "",
            description: noteToEdit.description || "",
            tag: noteToEdit.tag || "",
            type: noteToEdit.type || noteTypes[0], // Default type if missing
            isFeatured: noteToEdit.isFeatured || false,
            readTimeMinutes: noteToEdit.readTimeMinutes || "",
          });
          setIsComponentLoading(false);
        } else {
          console.error(
            `Access denied: User ${currentUser.email} cannot edit note ${id} owned by ${noteToEdit.user._id}`,
          );
          setError("You do not have permission to edit this note.");
          setIsComponentLoading(false);
        }
      } else {
        // Note with this ID wasn't found in the context's notes array
        console.error(
          `Note with ID ${id} not found in fetched notes for user ${currentUser.email}.`,
        );
        setError(
          "Note not found. It might have been deleted or you don't have access.",
        );
        setIsComponentLoading(false);
      }
    };

    // If NoteContext already has notes, try to find the note directly
    // This assumes `notes` in NoteContext contains *all* notes the current user
    // (admin or regular) should see based on the last `getNotes` call.
    if (notes.length > 0) {
      findAndSetNote(notes);
    } else {
      // If notes aren't loaded in context, trigger a fetch
      console.log(
        `Notes context empty, calling getNotes() for user ${currentUser.email}...`,
      );
      getNotes()
        .then((fetchedNotes) => {
          // Important: getNotes needs to return the fetched notes or update context state reliably
          // Re-accessing context state `notes` might not be immediate after fetch.
          // If getNotes updates the context state, we might rely on a re-render,
          // or ideally, getNotes returns the data directly for immediate use.
          // Let's assume getNotes updates context state and this effect re-runs.
          // If not, you'd call findAndSetNote(fetchedNotes) here.
          console.log("getNotes finished for edit page.");
          // The effect will re-run due to context changes, hopefully finding the note then.
          // Setting loading false here might be premature if the note isn't found yet.
          // findAndSetNote(notes) // Call it again? This depends heavily on context implementation.
          setIsComponentLoading(false); // Tentatively set loading false after fetch attempt
        })
        .catch((err) => {
          console.error("Error fetching notes for edit:", err);
          setError("Failed to load note data for editing.");
          setIsComponentLoading(false);
        });
    }
  }, [id, getNotes, notes, currentUser, isUserLoading]); // Dependencies for the effect

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // --- Basic Frontend Validation ---
    if (!note.title || note.title.length < 3) {
      setError("Title must be at least 3 characters long.");
      setIsSubmitting(false);
      return;
    }
    if (!note.description || note.description.length < 5) {
      setError("Description must be at least 5 characters long.");
      setIsSubmitting(false);
      return;
    }
    if (!note.type || !noteTypes.includes(note.type)) {
      setError("Please select a valid type.");
      setIsSubmitting(false);
      return;
    }
    // --- End Validation ---

    // --- Prepare data for update, considering role ---
    const updatedTitle = note.title;
    const updatedDescription = note.description;
    const updatedTag = note.tag;
    const updatedType = note.type;
    // ONLY include 'isFeatured' in the payload if the current user is an admin
    const updatedIsFeatured =
      currentUser?.role === "admin" ? note.isFeatured : undefined;
    // Backend recalculates readTimeMinutes, no need to send it unless API requires it
    // --- End Data Prep ---

    try {
      // Call the editNote function from context
      await editNote(
        id, // Note ID
        updatedTitle,
        updatedDescription,
        updatedTag,
        updatedType,
        updatedIsFeatured, // Pass the conditional value
      );
      console.log("Note update submitted successfully for ID:", id);
      navigate("/my-notes"); // Navigate back on success
    } catch (err) {
      console.error("Failed to update note:", err);
      setError(
        err.message ||
          "Failed to update note. Please check fields or try again.",
      );
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  // Handle changes in form inputs
  const onChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    // Update state based on input type (checkbox vs others)
    setNote({
      ...note,
      [name]: inputType === "checkbox" ? checked : value,
    });
  };

  // --- Reusable Tailwind classes (as defined in AddNote or your index.css) ---
  const baseTextColor = "text-gray-800 dark:text-gray-200";
  const inputBgColor = "bg-gray-50 dark:bg-gray-700";
  const inputBorderColor = "border-gray-300 dark:border-gray-600";
  const focusRingColor = "focus:ring-blue-500 dark:focus:ring-blue-400";
  const focusBorderColor = "focus:border-blue-500 dark:focus:border-blue-400";
  const primaryButtonClasses = `inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${focusRingColor} transition duration-150 ease-in-out`;
  const disabledButtonClasses =
    "bg-blue-400 dark:bg-blue-800 cursor-not-allowed";
  const errorTextColor = "text-red-600 dark:text-red-400";
  const inputClasses = `appearance-none relative block w-full px-3 py-2 border ${inputBorderColor} ${inputBgColor} ${baseTextColor} placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none ${focusRingColor} ${focusBorderColor} focus:z-10 sm:text-sm rounded-md`;
  const checkboxClasses = `h-4 w-4 text-blue-600 ${focusRingColor} border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 rounded`;
  const requiredMarkClasses = "text-error"; // Class for the asterisk
  // --- End Style Definitions ---

  // --- Combined Loading State Check ---
  // Show loading if user is loading OR if the component is loading the note data
  if (isUserLoading || isComponentLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }
  // --- End Loading Check ---

  // --- Error/Not Found State Check ---
  // Show error if loading is finished, an error exists, and note data wasn't populated
  if (!isUserLoading && !isComponentLoading && error && !note.title) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className={`text-lg ${errorTextColor} mb-4`}>{error}</p>
        <Link to="/my-notes" className={primaryButtonClasses}>
          Back to Notes
        </Link>
      </div>
    );
  }
  // --- End Error Check ---

  // --- Render the Form ---
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="p-8 md:p-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h1
          className={`text-2xl md:text-3xl font-bold ${baseTextColor} mb-6 text-center`}
        >
          Edit Note
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Submission Error */}
          {error &&
            note.title && ( // Only show submission errors if note is loaded
              <div
                className={`text-sm ${errorTextColor} text-center p-2 bg-red-100 dark:bg-red-900/20 rounded-md`}
              >
                {error}
              </div>
            )}

          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className={`block text-sm font-medium ${baseTextColor}`}
            >
              Title <span className={requiredMarkClasses}>*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              minLength="3"
              value={note.title}
              onChange={onChange}
              className={inputClasses}
              placeholder="Note Title"
              disabled={isSubmitting}
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label
              htmlFor="description"
              className={`block text-sm font-medium ${baseTextColor}`}
            >
              Description <span className={requiredMarkClasses}>*</span>
            </label>
            <textarea
              name="description"
              id="description"
              required
              minLength="5"
              rows="5"
              value={note.description}
              onChange={onChange}
              className={inputClasses}
              placeholder="Write your note here..."
              disabled={isSubmitting}
            ></textarea>
          </div>

          {/* Type Select */}
          <div>
            <label
              htmlFor="type"
              className={`block text-sm font-medium ${baseTextColor}`}
            >
              Type <span className={requiredMarkClasses}>*</span>
            </label>
            <select
              name="type"
              id="type"
              required
              value={note.type}
              onChange={onChange}
              className={inputClasses}
              disabled={isSubmitting}
            >
              {/* Map through defined note types */}
              {noteTypes.map((typeOption) => (
                <option key={typeOption} value={typeOption}>
                  {typeOption}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Input */}
          <div>
            <label
              htmlFor="tag"
              className={`block text-sm font-medium ${baseTextColor}`}
            >
              Tag <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              name="tag"
              id="tag"
              value={note.tag}
              onChange={onChange}
              className={inputClasses}
              placeholder="e.g., React, ProjectX"
              disabled={isSubmitting}
            />
          </div>

          {/* --- Conditionally Render Featured Checkbox --- */}
          {currentUser?.role === "admin" && (
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={note.isFeatured} // Bind to state
                onChange={onChange} // Use general onChange handler
                className={checkboxClasses} // Apply styles
                disabled={isSubmitting} // Disable during submission
              />
              <label
                htmlFor="isFeatured"
                className={`ml-2 block text-sm font-medium ${baseTextColor}`}
              >
                Mark as Featured (Admin Only)
              </label>
            </div>
          )}
          {/* --- End Conditional Checkbox --- */}

          {/* Action Buttons */}
          <div className="pt-4 flex space-x-3">
            {/* Submit Button */}
            <button
              type="submit"
              className={`${primaryButtonClasses} flex-1 ${
                isSubmitting ? disabledButtonClasses : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner /> : "Save Changes"}
            </button>
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/my-notes")} // Navigate back
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium ${baseTextColor} bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNote;
