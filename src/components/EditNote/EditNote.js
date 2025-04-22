// FILE: src/components/EditNote/EditNote.js
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
import TiptapLink from "@tiptap/extension-link"; // Correct import name
import MenuBar from "../EditorToolbar/MenuBar";

// Helper function (unchanged)
const generateCategoryOptions = (categories, parentId = null, level = 0) => {
  // ... (keep the existing implementation)
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
  // Contexts
  const {
    editNote,
    getNoteById,
    isFetchingNote, // Loading state for fetching the specific note
    singleNoteError, // Error specific to fetching/editing the single note
  } = useContext(NoteContext);
  const { categories, getCategories, isFetchingCategories, categoryTreeError } =
    useContext(CategoryContext);
  const { currentUser, isUserLoading } = useContext(UserContext); // User context for authorization

  // Router hooks
  const navigate = useNavigate();
  const { id } = useParams(); // Get note ID from URL

  // State
  const [noteFormData, setNoteFormData] = useState({
    _id: id,
    title: "",
    description: "",
    tag: "",
    categoryId: "",
    isFeatured: false,
    user: null, // Store user object from fetched note for authorization check
  });
  const [error, setError] = useState(""); // General form/validation errors
  const [isComponentLoading, setIsComponentLoading] = useState(true); // Loading state for the component itself (data fetch)
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [isAuthorized, setIsAuthorized] = useState(false); // Authorization state

  // Fetch categories if needed
  const fetchCategoriesIfNeeded = useCallback(async () => {
    if (
      categories.length === 0 &&
      !isFetchingCategories &&
      !isUserLoading && // Ensure user is loaded before fetching
      currentUser // Ensure user exists
    ) {
      console.log("EditNote: Fetching categories...");
      try {
        await getCategories();
      } catch (err) {
        console.error("Failed to fetch categories for EditNote:", err);
        setError("Could not load categories. Please try refreshing."); // Set general error
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

  // Handle category loading errors
  useEffect(() => {
    if (categoryTreeError) {
      setError((prev) =>
        prev
          ? `${prev}\nFailed to load categories: ${categoryTreeError}`
          : `Failed to load categories: ${categoryTreeError}`,
      );
    }
  }, [categoryTreeError]);

  // Tiptap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Placeholder.configure({ placeholder: "Write your note here..." }),
      TiptapLink.configure({ openOnClick: false, autolink: true }),
    ],
    content: "", // Initial content set after fetching data
    editable: false, // Initially not editable until data loads and authorized
    editorProps: {
      attributes: {
        class:
          "focus:outline-none p-4 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 text-neutral dark:text-gray-200",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      // Update description in form data state
      setNoteFormData((prevNote) => ({
        ...prevNote,
        description: currentEditor.getHTML(),
      }));
      // Basic client-side validation on update
      if (currentEditor?.getText().trim().length >= 5) {
        setError((prev) =>
          prev === "Description must be at least 5 characters long."
            ? ""
            : prev,
        );
      }
    },
  });

  // Fetch note data and check authorization on mount/ID change
  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    if (isUserLoading) {
      setIsComponentLoading(true); // Show loading while user data is fetched
      return;
    }
    if (!currentUser) {
      // If user is not logged in after check, redirect
      setError("Authentication required to edit notes.");
      setIsComponentLoading(false);
      if (isMounted) navigate("/login");
      return;
    }

    console.log(`EditNote Effect: User loaded, fetching note ID: ${id}`);
    setIsComponentLoading(true);
    setError(""); // Clear previous errors
    getNoteById(id)
      .then((fetchedNote) => {
        if (!isMounted) return; // Don't update state if component unmounted

        if (!fetchedNote) {
          // Handle note not found or other fetch errors from context
          setError(singleNoteError || "Note could not be loaded or not found."); // Use specific error from context if available
          setIsComponentLoading(false);
          setIsAuthorized(false); // Not authorized if note not found
          editor?.setEditable(false);
          return;
        }

        // --- MODIFICATION START ---
        // Authorization check: Owner or Admin/SuperAdmin
        const allowedAdminRoles = ["admin", "SuperAdmin"];
        const authorized =
          fetchedNote.user?._id === currentUser._id ||
          allowedAdminRoles.includes(currentUser.role);
        // --- MODIFICATION END ---

        setIsAuthorized(authorized); // Set authorization state

        if (authorized) {
          // Populate form data if authorized
          setNoteFormData({
            _id: fetchedNote._id,
            title: fetchedNote.title || "",
            description: fetchedNote.description || "",
            tag: fetchedNote.tag || "",
            categoryId: fetchedNote.category?._id || "",
            isFeatured: fetchedNote.isFeatured || false,
            user: fetchedNote.user, // Store user for potential checks
          });

          // Set editor content *after* editor is initialized
          if (editor && fetchedNote.description) {
            // Use timeout to ensure editor is ready for setContent
            setTimeout(
              () => editor?.commands.setContent(fetchedNote.description, false),
              0,
            );
          }
          editor?.setEditable(true); // Make editor editable
        } else {
          // Not authorized
          setError("You do not have permission to edit this note.");
          editor?.setEditable(false); // Keep editor non-editable
        }

        setIsComponentLoading(false); // Component loading finished
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error explicitly caught in EditNote data fetch:", err);
          setError(singleNoteError || "An error occurred loading the note.");
          setIsComponentLoading(false);
          setIsAuthorized(false);
          editor?.setEditable(false);
        }
      });

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [
    id,
    currentUser,
    isUserLoading,
    getNoteById,
    navigate,
    editor,
    singleNoteError, // Dependency for error handling
  ]);

  // Control editor editability based on state
  useEffect(() => {
    editor?.setEditable(!isSubmitting && !isComponentLoading && isAuthorized);
  }, [editor, isSubmitting, isComponentLoading, isAuthorized]);

  // Editor cleanup on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor || !isAuthorized) return; // Don't submit if not ready or authorized

    // Basic Client-side validation
    let currentError = ""; // Use a local variable
    if (!noteFormData.title || noteFormData.title.length < 3) {
      currentError = "Title must be at least 3 characters long.";
    }
    const descriptionContent = editor.getHTML(); // Get current HTML content
    if (
      (!descriptionContent || editor.getText().trim().length < 5) &&
      !currentError // Check only if title is valid
    ) {
      currentError = "Description must be at least 5 characters long.";
    }
    if (!noteFormData.categoryId && !currentError) {
      // Check only if previous fields valid
      currentError = "Please select a category.";
    }

    setError(currentError); // Set error state
    if (currentError) {
      return; // Stop if validation fails
    }

    setIsSubmitting(true);
    try {
      // --- MODIFICATION START ---
      // Check if user is admin/SuperAdmin before including isFeatured
      const allowedAdminRoles = ["admin", "SuperAdmin"];
      const finalIsFeatured = allowedAdminRoles.includes(currentUser?.role)
        ? noteFormData.isFeatured
        : undefined; // Undefined if not admin
      // --- MODIFICATION END ---

      await editNote(
        id,
        noteFormData.title,
        descriptionContent, // Pass the current editor content
        noteFormData.tag,
        noteFormData.categoryId,
        finalIsFeatured, // Pass potentially undefined value
      );
      console.log("Note update submitted successfully for ID:", id);
      navigate("/my-notes"); // Navigate on success
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

  // Handle input changes for standard form fields
  const onChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setNoteFormData((prevNote) => ({
      ...prevNote,
      [name]: inputType === "checkbox" ? checked : value,
    }));

    // Basic client-side validation on change
    if (name === "title" && value.length >= 3) {
      setError((prev) =>
        prev === "Title must be at least 3 characters long." ? "" : prev,
      );
    }
    if (name === "categoryId" && value) {
      setError((prev) => (prev === "Please select a category." ? "" : prev));
    }
  };

  // --- CSS Classes (for consistency) ---
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
  const errorTextClasses = `text-sm ${errorTextColor} text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-md`; // Error display

  // Memoized category options
  const categoryOptions = useMemo(
    () => generateCategoryOptions(categories),
    [categories],
  );

  // Determine overall loading state for the component
  const showLoading =
    isUserLoading || isFetchingNote || (!editor && !singleNoteError && !error); // Show loading if user/note is fetching, or editor not ready (and no error occurred preventing it)

  // --- Conditional Rendering ---

  // Initial Loading State
  if (showLoading && !error && !singleNoteError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Error State (especially for unauthorized or not found)
  const displayError = error || singleNoteError; // Combine general and specific errors
  if (!isComponentLoading && displayError && !isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className={`text-lg ${errorTextColor} mb-4`}>{displayError}</p>
        <Link to="/my-notes" className={primaryButtonClasses}>
          Back to Notes
        </Link>
      </div>
    );
  }

  // --- MODIFICATION START ---
  // Check if user is admin or SuperAdmin for conditional rendering
  const isAdminOrSuperAdmin = useMemo(() => {
    const allowedRoles = ["admin", "SuperAdmin"];
    return allowedRoles.includes(currentUser?.role);
  }, [currentUser?.role]);
  // --- MODIFICATION END ---

  // Form Render
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h1
          className={`text-2xl md:text-3xl font-bold ${baseTextColor} mb-6 text-center`}
        >
          Edit Note
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Errors */}
          {error && <div className={errorTextClasses}>{error}</div>}
          {/* Display specific note fetch error if general error isn't set */}
          {singleNoteError && !error && (
            <div className={errorTextClasses}>{singleNoteError}</div>
          )}

          {/* Title */}
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
              disabled={isSubmitting || !isAuthorized} // Disable if submitting or not authorized
            />
          </div>

          {/* Description Editor */}
          <div>
            <label htmlFor="description" className={labelClasses}>
              Description <span className={requiredMarkClasses}>*</span>
            </label>
            <div className="mt-1 shadow-sm">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} id="description" />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use the toolbar above to format your text.
            </p>
          </div>

          {/* Category & Tag */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Dropdown */}
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
                  !!categoryTreeError || // Disable if categories error
                  !isAuthorized // Disable if not authorized
                }
              >
                <option value="" disabled>
                  {isFetchingCategories
                    ? "Loading..."
                    : categoryTreeError // Check for category specific error
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
                value={noteFormData.tag}
                onChange={onChange}
                className={inputClasses + " mt-1"}
                placeholder="e.g., React, ProjectX"
                disabled={isSubmitting || !isAuthorized}
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
                checked={noteFormData.isFeatured}
                onChange={onChange}
                className={checkboxClasses}
                disabled={isSubmitting || !isAuthorized}
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
                isSubmitting ? disabledButtonClasses : ""
              }`}
              disabled={
                isSubmitting ||
                !editor ||
                !isAuthorized || // Ensure authorized
                isFetchingCategories || // Ensure categories loaded
                !!categoryTreeError // Ensure no category errors
              } // Disable if submitting, editor not ready, not authorized, or categories issue
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-notes")} // Or navigate back
              className={`${secondaryButtonClasses} flex-1 ${
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
