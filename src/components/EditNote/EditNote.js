import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import CategoryContext from "../../context/category/CategoryContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapLink from "@tiptap/extension-link";
// Image extension removed
import MenuBar from "../EditorToolbar/MenuBar";

// Define generateCategoryOptions at the top level of the file
const generateCategoryOptions = (categories, parentId = null, level = 0) => {
  const options = [];
  const children = categories.filter(
    (cat) => cat.parent === parentId || (!cat.parent && parentId === null),
  );
  children.sort((a, b) => a.name.localeCompare(b.name));
  children.forEach((cat) => {
    options.push(
      <option
        key={cat._id}
        value={cat._id}
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        {cat.name}
      </option>,
    );
    const subOptions = generateCategoryOptions(categories, cat._id, level + 1);
    options.push(...subOptions);
  });
  return options;
};

const EditNote = () => {
  const {
    // note: contextNote, // Not needed directly if we rely on getNoteById result
    editNote,
    getNoteById,
    isFetchingNote,
    singleNoteError,
    // error: generalNoteError, // Can use if needed for submit errors
  } = useContext(NoteContext);
  const { categories, getCategories, isFetchingCategories, categoryTreeError } =
    useContext(CategoryContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // Local state for the form, initialized empty
  const [noteFormData, setNoteFormData] = useState({
    _id: id,
    title: "",
    description: "",
    tag: "",
    categoryId: "",
    isFeatured: false,
    user: null, // Store user object temporarily for auth check
  });
  const [error, setError] = useState(""); // Local error for validation/API responses
  const [isComponentLoading, setIsComponentLoading] = useState(true); // Loading state for initial data
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [isAuthorized, setIsAuthorized] = useState(false); // Track authorization

  // Fetch categories if needed
  const fetchCategoriesIfNeeded = useCallback(async () => {
    if (
      categories.length === 0 &&
      !isFetchingCategories &&
      !isUserLoading &&
      currentUser
    ) {
      console.log("EditNote: Fetching categories...");
      try {
        await getCategories();
      } catch (err) {
        console.error("Failed to fetch categories for EditNote:", err);
        setError("Could not load categories. Please try refreshing."); // Set local error
      }
    }
  }, [
    categories.length,
    getCategories,
    isFetchingCategories,
    isUserLoading,
    currentUser,
  ]);

  useEffect(() => {
    fetchCategoriesIfNeeded();
  }, [fetchCategoriesIfNeeded]);

  // Display category loading error if it exists
  useEffect(() => {
    if (categoryTreeError) {
      setError((prev) =>
        prev
          ? `${prev}\nFailed to load categories: ${categoryTreeError}`
          : `Failed to load categories: ${categoryTreeError}`,
      );
    }
  }, [categoryTreeError]);

  // Tiptap Editor Setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Placeholder.configure({ placeholder: "Write your note here..." }),
      TiptapLink.configure({ openOnClick: false, autolink: true }),
      // Image removed
    ],
    content: "", // Initial content set in useEffect later
    editable: false, // Start as non-editable
    editorProps: {
      attributes: {
        class:
          // REMOVED: prose dark:prose-invert prose-sm sm:prose-base
          "focus:outline-none p-4 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 text-neutral dark:text-gray-200", // Kept other styles
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setNoteFormData((prevNote) => ({
        ...prevNote,
        description: currentEditor.getHTML(),
      }));
      // Clear description error when user types
      if (currentEditor?.getText().trim().length >= 5) {
        setError((prev) =>
          prev === "Description must be at least 5 characters long."
            ? ""
            : prev,
        );
      }
    },
  });

  // Effect to load the specific note data using getNoteById
  useEffect(() => {
    let isMounted = true;
    if (isUserLoading) {
      setIsComponentLoading(true); // Still wait for user data
      return;
    }
    if (!currentUser) {
      setError("Authentication required to edit notes.");
      setIsComponentLoading(false);
      if (isMounted) navigate("/login");
      return;
    }

    console.log(`EditNote Effect: User loaded, fetching note ID: ${id}`);
    setIsComponentLoading(true);
    setError(""); // Clear local errors before fetching

    getNoteById(id)
      .then((fetchedNote) => {
        if (!isMounted) return;

        if (!fetchedNote) {
          // Error state (singleNoteError) is set within getNoteById
          setError(singleNoteError || "Note could not be loaded or not found."); // Use context error or default
          setIsComponentLoading(false);
          setIsAuthorized(false); // Ensure not authorized if note failed to load
          editor?.setEditable(false);
          return;
        }

        // Authorization Check
        const authorized =
          fetchedNote.user?._id === currentUser._id ||
          currentUser.role === "admin";

        setIsAuthorized(authorized); // Set authorization state

        if (authorized) {
          setNoteFormData({
            _id: fetchedNote._id,
            title: fetchedNote.title || "",
            description: fetchedNote.description || "",
            tag: fetchedNote.tag || "",
            categoryId: fetchedNote.category?._id || "",
            isFeatured: fetchedNote.isFeatured || false,
            user: fetchedNote.user,
          });
          if (editor && fetchedNote.description) {
            // Use timeout 0 to ensure editor state is ready after mount/update
            setTimeout(
              () => editor?.commands.setContent(fetchedNote.description, false),
              0,
            );
          }
          editor?.setEditable(true);
        } else {
          setError("You do not have permission to edit this note.");
          editor?.setEditable(false);
        }
        setIsComponentLoading(false);
      })
      .catch((err) => {
        // Catch potential promise rejection if getNoteById throws unexpectedly
        if (isMounted) {
          console.error("Error explicitly caught in EditNote data fetch:", err);
          setError(singleNoteError || "An error occurred loading the note.");
          setIsComponentLoading(false);
          setIsAuthorized(false);
          editor?.setEditable(false);
        }
      });

    return () => {
      isMounted = false;
    };
    // getNoteById and singleNoteError added as dependencies
  }, [
    id,
    currentUser,
    isUserLoading,
    getNoteById,
    navigate,
    editor,
    singleNoteError,
  ]);

  // Update editor editable state based on loading/submitting/authorization
  useEffect(() => {
    editor?.setEditable(!isSubmitting && !isComponentLoading && isAuthorized);
  }, [editor, isSubmitting, isComponentLoading, isAuthorized]);

  // Editor cleanup
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor || !isAuthorized) return;

    let currentError = ""; // Local variable for validation

    // Validation
    if (!noteFormData.title || noteFormData.title.length < 3) {
      currentError = "Title must be at least 3 characters long.";
    }
    const descriptionContent = editor.getHTML();
    if (
      (!descriptionContent || editor.getText().trim().length < 5) &&
      !currentError
    ) {
      currentError = "Description must be at least 5 characters long.";
    }
    if (!noteFormData.categoryId && !currentError) {
      currentError = "Please select a category.";
    }

    setError(currentError); // Set final validation error state

    if (currentError) {
      return; // Stop if validation failed
    }

    setIsSubmitting(true);

    try {
      await editNote(
        id,
        noteFormData.title,
        descriptionContent, // Use content directly from editor
        noteFormData.tag,
        noteFormData.categoryId,
        currentUser?.role === "admin" ? noteFormData.isFeatured : undefined, // Conditionally include isFeatured
      );
      console.log("Note update submitted successfully for ID:", id);
      navigate("/my-notes");
    } catch (err) {
      console.error("Failed to update note:", err);
      setError(
        err.message ||
          "Failed to update note. Please check fields or try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle changes in regular input fields
  const onChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setNoteFormData((prevNote) => ({
      ...prevNote,
      [name]: inputType === "checkbox" ? checked : value,
    }));
    // Clear specific validation errors on change
    if (name === "title" && value.length >= 3) {
      setError((prev) =>
        prev === "Title must be at least 3 characters long." ? "" : prev,
      );
    }
    if (name === "categoryId" && value) {
      setError((prev) => (prev === "Please select a category." ? "" : prev));
    }
  };

  // Styles
  const baseTextColor = "text-gray-800 dark:text-gray-200";
  const inputClasses = `appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 ${baseTextColor} placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm rounded-md`;
  const primaryButtonClasses = `inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out`;
  const secondaryButtonClasses = `inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium ${baseTextColor} bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out`;
  const disabledButtonClasses =
    "bg-blue-400 dark:bg-blue-800 cursor-not-allowed opacity-50";
  const errorTextColor = "text-red-600 dark:text-red-400";
  const checkboxClasses = `h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 rounded`;
  const requiredMarkClasses = "text-error";
  const labelClasses = `block text-sm font-medium ${baseTextColor}`;
  const errorTextClasses = `text-sm ${errorTextColor} text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-md`; // For consistency

  const categoryOptions = useMemo(
    () => generateCategoryOptions(categories),
    [categories],
  );

  // Use the specific fetching state for the single note
  const showLoading =
    isUserLoading || isFetchingNote || (!editor && !singleNoteError && !error); // Show loading if user is loading, note is fetching, or editor isn't ready yet (and no error occurred)

  if (showLoading && !error && !singleNoteError) {
    // Don't show main spinner if there was already an error
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle errors: authorization, note not found, category loading error
  const displayError = error || singleNoteError; // Combine local and fetch errors

  if (!isComponentLoading && displayError && !isAuthorized) {
    // Show error if loading is done, there's an error, and user isn't authorized
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className={`text-lg ${errorTextColor} mb-4`}>{displayError}</p>
        <Link to="/my-notes" className={primaryButtonClasses}>
          Back to Notes
        </Link>
      </div>
    );
  }

  // Render the form only if authorized (even if categories are still loading/failed)
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h1
          className={`text-2xl md:text-3xl font-bold ${baseTextColor} mb-6 text-center`}
        >
          Edit Note
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display local validation errors or submit errors */}
          {error && <div className={errorTextClasses}>{error}</div>}
          {/* Display context error if it exists and local error is cleared */}
          {singleNoteError && !error && (
            <div className={errorTextClasses}>{singleNoteError}</div>
          )}

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
              value={noteFormData.title}
              onChange={onChange}
              className={inputClasses + " mt-1"}
              placeholder="Note Title"
              disabled={isSubmitting || !isAuthorized} // Also disable if not authorized
            />
          </div>

          {/* Description Editor */}
          <div>
            <label htmlFor="description" className={labelClasses}>
              Description <span className={requiredMarkClasses}>*</span>
            </label>
            {/* Removed border-collapse */}
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
              <label htmlFor="categoryId" className={labelClasses}>
                Category <span className={requiredMarkClasses}>*</span>
              </label>
              <select
                name="categoryId"
                id="categoryId"
                required
                value={noteFormData.categoryId}
                onChange={onChange}
                className={inputClasses + " mt-1"}
                disabled={
                  isSubmitting ||
                  isFetchingCategories ||
                  categories.length === 0 ||
                  !!categoryTreeError || // Disable if categories failed to load
                  !isAuthorized
                }
              >
                <option value="" disabled>
                  {isFetchingCategories
                    ? "Loading..."
                    : categoryTreeError // Show category loading error
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
                value={noteFormData.tag}
                onChange={onChange}
                className={inputClasses + " mt-1"}
                placeholder="e.g., React, ProjectX"
                disabled={isSubmitting || !isAuthorized}
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
                checked={noteFormData.isFeatured}
                onChange={onChange}
                className={checkboxClasses}
                disabled={isSubmitting || !isAuthorized}
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
                // Use flex-1
                isSubmitting ? disabledButtonClasses : ""
              }`}
              disabled={
                isSubmitting ||
                !editor ||
                !isAuthorized ||
                isFetchingCategories ||
                !!categoryTreeError
              } // Disable if not authorized or categories have issues
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-notes")} // Still navigates to /my-notes
              className={`${secondaryButtonClasses} flex-1 ${
                // Use flex-1
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
