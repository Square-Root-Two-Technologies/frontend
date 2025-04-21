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
// Image extension removed
import MenuBar from "../EditorToolbar/MenuBar";

// Define generateCategoryOptions at the top level of the file
const generateCategoryOptions = (categories, parentId = null, level = 0) => {
  const options = [];
  const children = categories.filter(
    (cat) => cat.parent === parentId || (!cat.parent && parentId === null), // Check both ObjectId and null/undefined parent
  );
  children.sort((a, b) => a.name.localeCompare(b.name)); // Sort children alphabetically
  children.forEach((cat) => {
    options.push(
      <option
        key={cat._id}
        value={cat._id}
        style={{ paddingLeft: `${level * 1.5}rem` }} // Indent subcategories
      >
        {cat.name}
      </option>,
    );
    // Recursively generate options for children
    const subOptions = generateCategoryOptions(categories, cat._id, level + 1);
    options.push(...subOptions);
  });
  return options;
};

const AddNote = () => {
  const navigate = useNavigate();
  const { addNote, error: noteError } = useContext(NoteContext); // Use error state from context if preferred
  const {
    categories,
    getCategories,
    isFetchingCategories,
    categoryTreeError, // Use error from category context
  } = useContext(CategoryContext);
  const { currentUser } = useContext(UserContext);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteTag, setNoteTag] = useState("");
  const [noteCategoryId, setNoteCategoryId] = useState("");
  const [noteIsFeatured, setNoteIsFeatured] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [error, setError] = useState(""); // Local error state for form validation
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategoriesIfNeeded = useCallback(async () => {
    if (categories.length === 0 && !isFetchingCategories) {
      console.log("AddNote: Fetching categories...");
      try {
        await getCategories();
      } catch (err) {
        console.error("Failed to fetch categories for AddNote:", err);
        // Error display is now handled by checking categoryTreeError below
      }
    }
  }, [categories.length, getCategories, isFetchingCategories]);

  useEffect(() => {
    fetchCategoriesIfNeeded();
  }, [fetchCategoriesIfNeeded]);

  // Display category loading error if it exists
  useEffect(() => {
    if (categoryTreeError) {
      setError(`Failed to load categories: ${categoryTreeError}`);
    } else {
      // Clear error if categories load successfully later
      setError((prev) =>
        prev.startsWith("Failed to load categories:") ? "" : prev,
      );
    }
  }, [categoryTreeError]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Placeholder.configure({ placeholder: "Write your note here..." }),
      Link.configure({ openOnClick: false, autolink: true }),
      // Image extension removed
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
      // Clear description error when user types
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
          // REMOVED: prose dark:prose-invert prose-sm sm:prose-base
          "focus:outline-none p-4 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 text-neutral dark:text-gray-200", // Kept other styles
      },
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let currentError = ""; // Use temporary variable for validation
    if (!noteTitle || noteTitle.length < 3) {
      currentError = "Title must be at least 3 characters long.";
    } else if (
      !editorContent ||
      editorContent === "<p></p>" ||
      editor?.getText().trim().length < 5
    ) {
      currentError = "Description must be at least 5 characters long.";
    } else if (!noteCategoryId) {
      currentError = "Please select a category.";
    }

    setError(currentError); // Set local error state after all checks

    if (currentError) {
      return; // Stop if there's a validation error
    }

    setIsLoading(true);

    try {
      const noteToAdd = {
        title: noteTitle,
        description: editorContent,
        tag: noteTag || "General",
        categoryId: noteCategoryId,
        isFeatured: noteIsFeatured,
      };

      if (currentUser?.role !== "admin") {
        delete noteToAdd.isFeatured;
      }

      const response = await addNote(noteToAdd); // addNote now potentially sets context error

      if (response.success) {
        navigate("/my-notes");
      } else {
        // Display error from addNote response (could be validation or server error)
        setError(response.message || "Failed to add note. Please try again.");
      }
    } catch (err) {
      // This catch block might be less likely if addNote handles its own errors
      console.error("Add note submission error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Styles
  const inputFieldClasses = "input-field mt-1";
  const labelClasses =
    "block text-sm font-medium text-neutral dark:text-gray-200";
  const errorTextClasses =
    "text-sm text-error text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-md my-4";
  const requiredMarkClasses = "text-error";
  const checkboxClasses = `h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 rounded`;
  const primaryButtonClasses = `btn-primary`;
  const secondaryButtonClasses = `btn-secondary`;

  const categoryOptions = useMemo(
    () => generateCategoryOptions(categories),
    [categories],
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="card w-full max-w-4xl">
        {" "}
        {/* Adjusted max-width */}
        <h1 className="text-heading mb-6 text-center">Add New Note</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display local validation or API errors */}
          {error && <div className={errorTextClasses}>{error}</div>}
          {/* Display context-based API errors if preferred */}
          {/* {noteError && !error && <div className={errorTextClasses}>{noteError}</div>} */}

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
                // Clear title error when user types
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
            {/* Removed border-collapse from wrapper div */}
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
            {/* Category Select */}
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
                  // Clear category error when selected
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
                  !!categoryTreeError // Also disable if categories failed to load
                }
              >
                <option value="" disabled>
                  {isFetchingCategories
                    ? "Loading categories..."
                    : categoryTreeError // Check for category loading error
                    ? "Error loading categories"
                    : categories.length === 0
                    ? "No categories available"
                    : "Select a category"}
                </option>
                {categoryOptions}
              </select>
              {isFetchingCategories && !categoryTreeError && (
                <LoadingSpinner size="sm" />
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

          {/* Featured Checkbox (Admin Only) */}
          {currentUser?.role === "admin" && (
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
                Mark as Featured (Admin Only)
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className={`${primaryButtonClasses} flex-1 ${
                // Use flex-1 for equal width
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={
                isLoading ||
                !editor ||
                isFetchingCategories ||
                !!categoryTreeError
              }
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Add Note"}
            </button>
            {/* Added Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/my-notes")} // Navigate back to notes list
              className={`${secondaryButtonClasses} flex-1`} // Use flex-1 and secondary style
              disabled={isLoading} // Disable when submitting
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
