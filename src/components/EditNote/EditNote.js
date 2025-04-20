// src/components/EditNote/EditNote.js
import React, { useState, useContext, useEffect, useCallback } from "react"; // Added useCallback
import { useNavigate, useParams, Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapLink from "@tiptap/extension-link"; // Correct import name
import Image from "@tiptap/extension-image";
import MenuBar from "../EditorToolbar/MenuBar";

// --- Helper function to generate hierarchical options (same as in AddNote) ---
const generateCategoryOptions = (categories, parentId = null, level = 0) => {
  const options = [];
  const children = categories.filter((cat) => cat.parent === parentId);

  children.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

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
    // Recursively add children
    options.push(...generateCategoryOptions(categories, cat._id, level + 1));
  });

  return options;
};

const EditNote = () => {
  const {
    notes,
    editNote,
    getNotes,
    categories, // Still use flat list for generating options
    getCategories, // Keep fetching flat list
    // Optionally fetch tree if preferred: fetchCategoryTree, categoryTree
  } = useContext(NoteContext);
  const { currentUser, isUserLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [note, setNote] = useState({
    _id: id,
    title: "",
    description: "",
    tag: "",
    categoryId: "",
    isFeatured: false,
  });
  const [error, setError] = useState("");
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [areCategoriesLoading, setAreCategoriesLoading] = useState(false); // State for category loading

  const fetchCategoriesIfNeeded = useCallback(async () => {
    if (categories.length === 0 && !isUserLoading && currentUser) {
      setAreCategoriesLoading(true);
      try {
        await getCategories();
      } catch (err) {
        console.error("Failed to fetch categories for EditNote:", err);
        setError("Could not load categories. Please try refreshing.");
      } finally {
        setAreCategoriesLoading(false);
      }
    }
  }, [categories.length, getCategories, isUserLoading, currentUser]);

  useEffect(() => {
    fetchCategoriesIfNeeded();
  }, [fetchCategoriesIfNeeded]); // Fetch categories when component loads

  const editor = useEditor({
    // ... (editor configuration remains the same)
    extensions: [
      StarterKit.configure({
        /* ... */
      }),
      Placeholder.configure({ placeholder: "Write your note here..." }),
      TiptapLink.configure({ openOnClick: false, autolink: true }), // Use correct name
      Image.configure({
        inline: false,
        HTMLAttributes: {
          /* ... */
        },
      }),
    ],
    content: "", // Initialize empty, set later
    editorProps: {
      attributes: {
        /* ... */
        class:
          "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none p-4 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 text-neutral dark:text-gray-200",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setNote((prevNote) => ({
        ...prevNote,
        description: currentEditor.getHTML(),
      }));
    },
  });

  // Effect to find the note to edit and populate the form
  useEffect(() => {
    let isMounted = true;
    if (isUserLoading) {
      setIsComponentLoading(true);
      return;
    }
    if (!currentUser) {
      setError("Authentication required to edit notes.");
      setIsComponentLoading(false);
      navigate("/login");
      return;
    }
    setIsComponentLoading(true);
    setError("");

    const findAndSetNote = (notesArray) => {
      const noteToEdit = notesArray.find((n) => n._id === id);
      if (noteToEdit) {
        if (
          noteToEdit.user?._id === currentUser._id ||
          currentUser.role === "admin"
        ) {
          if (isMounted) {
            setNote({
              _id: noteToEdit._id,
              title: noteToEdit.title || "",
              description: noteToEdit.description || "", // Store raw description
              tag: noteToEdit.tag || "",
              categoryId: noteToEdit.category?._id || "",
              isFeatured: noteToEdit.isFeatured || false,
            });
            setIsComponentLoading(false);
          }
        } else {
          /* Permission denied */
        }
      } else {
        /* Not found */
      }
    };

    if (notes.length > 0) {
      findAndSetNote(notes);
    } else {
      getNotes()
        .then((fetchedNotes) => {
          if (isMounted) findAndSetNote(fetchedNotes || []);
        })
        .catch((err) => {
          /* Error handling */
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id, getNotes, notes, currentUser, isUserLoading, navigate]);

  // Effect to set editor content once note data is loaded
  useEffect(() => {
    if (editor && !isComponentLoading && note.description) {
      const currentEditorContent = editor.getHTML();
      // Avoid unnecessary updates if content is already correct
      if (currentEditorContent !== note.description) {
        editor.commands.setContent(note.description, false); // Don't emit update event
      }
    }
  }, [editor, note.description, isComponentLoading]);

  // Effect to manage editor editability during submission
  useEffect(() => {
    editor?.setEditable(!isSubmitting);
  }, [editor, isSubmitting]);

  // Cleanup editor instance
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // --- Validation Checks ---
    if (!note.title || note.title.length < 3) {
      setError("Title must be at least 3 characters long.");
      setIsSubmitting(false);
      return;
    }
    if (!editor || editor.getText().trim().length < 5) {
      setError("Description must be at least 5 characters long.");
      setIsSubmitting(false);
      return;
    }
    if (!note.categoryId) {
      setError("Please select a category.");
      setIsSubmitting(false);
      return;
    }
    // --- End Validation ---

    const updatedTitle = note.title;
    const updatedDescription = editor.getHTML(); // Get current HTML from editor
    const updatedTag = note.tag;
    const updatedCategoryId = note.categoryId;
    const updatedIsFeatured =
      currentUser?.role === "admin" ? note.isFeatured : undefined;

    try {
      await editNote(
        id,
        updatedTitle,
        updatedDescription, // Send the potentially modified description
        updatedTag,
        updatedCategoryId,
        updatedIsFeatured,
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

  const onChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  };

  // --- Class Definitions ---
  const baseTextColor = "text-gray-800 dark:text-gray-200";
  const inputBgColor = "bg-gray-50 dark:bg-gray-700";
  const inputBorderColor = "border-gray-300 dark:border-gray-600";
  const focusRingColor = "focus:ring-blue-500 dark:focus:ring-blue-400";
  const focusBorderColor = "focus:border-blue-500 dark:focus:border-blue-400";
  const primaryButtonClasses = `inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${focusRingColor} transition duration-150 ease-in-out`;
  const disabledButtonClasses =
    "bg-blue-400 dark:bg-blue-800 cursor-not-allowed opacity-50";
  const errorTextColor = "text-red-600 dark:text-red-400";
  const inputClasses = `appearance-none relative block w-full px-3 py-2 border ${inputBorderColor} ${inputBgColor} ${baseTextColor} placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none ${focusRingColor} ${focusBorderColor} focus:z-10 sm:text-sm rounded-md`;
  const checkboxClasses = `h-4 w-4 text-blue-600 ${focusRingColor} border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 rounded`;
  const requiredMarkClasses = "text-error";
  // --- End Class Definitions ---

  // Generate hierarchical options for the dropdown
  const categoryOptions = generateCategoryOptions(categories);

  if (isUserLoading || isComponentLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state if note couldn't be loaded
  if (!isComponentLoading && error && !note.title) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className={`text-lg ${errorTextColor} mb-4`}>{error}</p>
        <Link to="/my-notes" className={primaryButtonClasses}>
          Back to Notes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h1
          className={`text-2xl md:text-3xl font-bold ${baseTextColor} mb-6 text-center`}
        >
          Edit Note
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className={`text-sm ${errorTextColor} text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-md`}
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
              className={inputClasses + " mt-1"}
              placeholder="Note Title"
              disabled={isSubmitting}
            />
          </div>

          {/* Description Editor */}
          <div>
            <label
              htmlFor="description"
              className={`block text-sm font-medium ${baseTextColor}`}
            >
              Description <span className={requiredMarkClasses}>*</span>
            </label>
            <div className="mt-1 border-collapse shadow-sm">
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
              <label
                htmlFor="categoryId"
                className={`block text-sm font-medium ${baseTextColor}`}
              >
                Category <span className={requiredMarkClasses}>*</span>
              </label>
              <select
                name="categoryId"
                id="categoryId"
                required
                value={note.categoryId}
                onChange={onChange}
                className={inputClasses + " mt-1"}
                disabled={
                  isSubmitting ||
                  areCategoriesLoading ||
                  categories.length === 0
                }
              >
                <option value="" disabled>
                  {areCategoriesLoading
                    ? "Loading..."
                    : categories.length === 0
                    ? "No categories available"
                    : "Select a category"}
                </option>
                {/* Render hierarchical options */}
                {categoryOptions}
              </select>
              {areCategoriesLoading && <LoadingSpinner />}
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
                className={inputClasses + " mt-1"}
                placeholder="e.g., React, ProjectX"
                disabled={isSubmitting}
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
                checked={note.isFeatured}
                onChange={onChange}
                className={checkboxClasses}
                disabled={isSubmitting}
              />
              <label
                htmlFor="isFeatured"
                className={`ml-2 block text-sm font-medium ${baseTextColor}`}
              >
                Mark as Featured (Admin Only)
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4 flex space-x-4">
            <button
              type="submit"
              className={`${primaryButtonClasses} flex-1 ${
                isSubmitting ? disabledButtonClasses : ""
              }`}
              disabled={isSubmitting || !editor || areCategoriesLoading}
            >
              {isSubmitting ? <LoadingSpinner /> : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-notes")}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium ${baseTextColor} bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900 ${
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
