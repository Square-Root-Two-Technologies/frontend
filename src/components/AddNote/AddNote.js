// FILE: src/components/AddNote/AddNote.js
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import CategoryContext from "../../context/category/CategoryContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import MenuBar from "../EditorToolbar/MenuBar";

// Helper function to generate nested options (unchanged)
const generateCategoryOptions = (categories, parentId = null, level = 0) => {
  // ... (keep the existing implementation)
  const options = [];
  const children = categories.filter(
    (cat) => cat.parent === parentId || (!cat.parent && parentId === null), // Handle both ObjectId and null/undefined parents
  );
  children.sort((a, b) => a.name.localeCompare(b.name)); // Sort children alphabetically
  children.forEach((cat) => {
    options.push(
      <option
        key={cat._id}
        value={cat._id}
        style={{ paddingLeft: `${level * 1.5}rem` }} // Indent subcategories
      >
        {/* &nbsp;&nbsp; repeated ${level} times */}
        {cat.name}
      </option>,
    );
    // Recursively generate options for subcategories
    const subOptions = generateCategoryOptions(categories, cat._id, level + 1);
    options.push(...subOptions);
  });
  return options;
};

const AddNote = () => {
  const navigate = useNavigate();
  const { addNote, error: noteError } = useContext(NoteContext); // Assuming addNote might return errors
  const {
    categories,
    getCategories,
    isFetchingCategories,
    categoryTreeError, // Use the specific error for tree/categories
  } = useContext(CategoryContext);
  const { currentUser } = useContext(UserContext); // Get current user info

  // State for form fields
  const [noteTitle, setNoteTitle] = useState("");
  const [noteTag, setNoteTag] = useState("");
  const [noteCategoryId, setNoteCategoryId] = useState("");
  const [noteIsFeatured, setNoteIsFeatured] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const [error, setError] = useState(""); // General form error
  const [isLoading, setIsLoading] = useState(false); // Loading state for submission

  // Fetch categories if they aren't loaded
  const fetchCategoriesIfNeeded = useCallback(async () => {
    if (categories.length === 0 && !isFetchingCategories) {
      console.log("AddNote: Fetching categories...");
      try {
        await getCategories();
      } catch (err) {
        console.error("Failed to fetch categories for AddNote:", err);
        // setError("Could not load categories. Please try refreshing."); // Optionally set error here
      }
    }
  }, [categories.length, getCategories, isFetchingCategories]);

  useEffect(() => {
    fetchCategoriesIfNeeded();
  }, [fetchCategoriesIfNeeded]);

  // Handle category loading errors
  useEffect(() => {
    if (categoryTreeError) {
      setError(`Failed to load categories: ${categoryTreeError}`);
    } else {
      // Clear the error if it was previously related to categories and now it's resolved
      setError((prev) =>
        prev.startsWith("Failed to load categories:") ? "" : prev,
      );
    }
  }, [categoryTreeError]);

  // Tiptap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Placeholder.configure({ placeholder: "Write your note here..." }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
      // Basic client-side validation on update
      if (editor?.getText().trim().length >= 5) {
        setError((prev) =>
          prev === "Description must be at least 5 characters long."
            ? ""
            : prev,
        );
      }
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none p-4 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 text-neutral dark:text-gray-200", // Min height + styling
      },
    },
  });

  // Cleanup editor instance
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Client-side validation
    let currentError = ""; // Use a local variable for current submission errors
    if (!noteTitle || noteTitle.length < 3) {
      currentError = "Title must be at least 3 characters long.";
    } else if (
      !editorContent ||
      editorContent === "<p></p>" || // Check for empty paragraph
      editor?.getText().trim().length < 5
    ) {
      currentError = "Description must be at least 5 characters long.";
    } else if (!noteCategoryId) {
      currentError = "Please select a category.";
    }

    setError(currentError); // Set the error state
    if (currentError) {
      return; // Stop submission if there are errors
    }

    setIsLoading(true);
    try {
      const noteToAdd = {
        title: noteTitle,
        description: editorContent,
        tag: noteTag || "General",
        categoryId: noteCategoryId,
        isFeatured: noteIsFeatured, // Include isFeatured initially
      };

      // --- MODIFICATION START ---
      // Only include 'isFeatured' if user is admin or SuperAdmin
      const allowedAdminRoles = ["admin", "SuperAdmin"];
      if (!allowedAdminRoles.includes(currentUser?.role)) {
        delete noteToAdd.isFeatured; // Remove it if user is not admin/SuperAdmin
        console.log(
          "AddNote: Non-admin submitting, 'isFeatured' flag removed.",
        );
      } else {
        console.log(
          `AddNote: Admin/SuperAdmin submitting, 'isFeatured' flag value: ${noteIsFeatured}`,
        );
      }
      // --- MODIFICATION END ---

      const response = await addNote(noteToAdd); // Call context function

      if (response.success) {
        navigate("/my-notes"); // Navigate on success
      } else {
        // Handle errors from the backend context function
        setError(response.message || "Failed to add note. Please try again.");
      }
    } catch (err) {
      console.error("Add note submission error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // CSS Classes for styling consistency
  const inputFieldClasses = "input-field mt-1";
  const labelClasses =
    "block text-sm font-medium text-neutral dark:text-gray-200";
  const errorTextClasses =
    "text-sm text-error text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-md my-4";
  const requiredMarkClasses = "text-error";
  const checkboxClasses = `h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 rounded`;
  const primaryButtonClasses = `btn-primary`;
  const secondaryButtonClasses = `btn-secondary`;

  // Generate category options using the memoized helper
  const categoryOptions = useMemo(
    () => generateCategoryOptions(categories),
    [categories],
  );

  // --- MODIFICATION START ---
  // Check if user is admin or SuperAdmin for conditional rendering
  const isAdminOrSuperAdmin = useMemo(() => {
    const allowedRoles = ["admin", "SuperAdmin"];
    return allowedRoles.includes(currentUser?.role);
  }, [currentUser?.role]);
  // --- MODIFICATION END ---

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="card w-full max-w-4xl">
        {" "}
        {/* Increased max-width */}
        <h1 className="text-heading mb-6 text-center">Add New Note</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Error Messages */}
          {error && <div className={errorTextClasses}>{error}</div>}
          {/* {noteError && <div className={errorTextClasses}>{noteError}</div>} */}

          {/* Title Input */}
          <div>
            <label htmlFor="title" className={labelClasses}>
              Title <span className={requiredMarkClasses}>*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              minLength="3"
              value={noteTitle}
              onChange={(e) => {
                setNoteTitle(e.target.value);
                // Basic client-side validation on change
                if (e.target.value.length >= 3) {
                  setError((prev) =>
                    prev === "Title must be at least 3 characters long."
                      ? ""
                      : prev,
                  );
                }
              }}
              className={inputFieldClasses}
              placeholder="Note Title"
              disabled={isLoading}
            />
          </div>

          {/* Description Editor */}
          <div>
            <label htmlFor="description" className={labelClasses}>
              Description <span className={requiredMarkClasses}>*</span>
            </label>
            {/* Tiptap Editor Integration */}
            <div className="mt-1 shadow-sm">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} id="description" />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use the toolbar above to format your text.
            </p>
          </div>

          {/* Category and Tag Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div>
              <label htmlFor="category" className={labelClasses}>
                Category <span className={requiredMarkClasses}>*</span>
              </label>
              <select
                name="category"
                id="category"
                required
                value={noteCategoryId}
                onChange={(e) => {
                  setNoteCategoryId(e.target.value);
                  // Basic client-side validation on change
                  if (e.target.value) {
                    setError((prev) =>
                      prev === "Please select a category." ? "" : prev,
                    );
                  }
                }}
                className={inputFieldClasses}
                disabled={
                  isLoading ||
                  isFetchingCategories ||
                  categories.length === 0 ||
                  !!categoryTreeError // Disable if categories are loading, none available, or error
                }
              >
                <option value="" disabled>
                  {isFetchingCategories
                    ? "Loading categories..."
                    : categoryTreeError // Check for specific category loading error first
                    ? "Error loading categories"
                    : categories.length === 0
                    ? "No categories available"
                    : "Select a category"}
                </option>
                {categoryOptions}
              </select>
              {isFetchingCategories && !categoryTreeError && (
                <LoadingSpinner size="sm" /> // Show spinner only if loading and no error
              )}
            </div>

            {/* Tag Input */}
            <div>
              <label htmlFor="tag" className={labelClasses}>
                Tag <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                name="tag"
                id="tag"
                value={noteTag}
                onChange={(e) => setNoteTag(e.target.value)}
                className={inputFieldClasses}
                placeholder="e.g., React, API, Tip"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Featured Checkbox (Admin/SuperAdmin Only) */}
          {/* --- MODIFICATION START --- */}
          {isAdminOrSuperAdmin && (
            // --- MODIFICATION END ---
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={noteIsFeatured}
                onChange={(e) => setNoteIsFeatured(e.target.checked)}
                className={checkboxClasses}
                disabled={isLoading}
              />
              <label
                htmlFor="isFeatured"
                className={`ml-2 block text-sm font-medium ${labelClasses}`}
              >
                Mark as Featured (Admin/SuperAdmin Only)
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className={`${primaryButtonClasses} flex-1 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={
                isLoading ||
                !editor ||
                isFetchingCategories ||
                !!categoryTreeError
              } // Disable if submitting, editor not ready, or categories not loaded/error
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Add Note"}
            </button>
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/my-notes")} // Or navigate back
              className={`${secondaryButtonClasses} flex-1`} // Ensure cancel button also uses flex-1
              disabled={isLoading} // Disable cancel during submission too
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
