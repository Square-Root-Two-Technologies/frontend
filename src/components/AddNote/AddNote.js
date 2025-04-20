// src/components/AddNote/AddNote.js
import React, { useState, useContext, useEffect, useCallback } from "react"; // Added useCallback
import { useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import MenuBar from "../EditorToolbar/MenuBar";

// --- Helper function to generate hierarchical options ---
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

const AddNote = () => {
  const navigate = useNavigate();
  const {
    addNote,
    categories, // Still use flat list for generating options
    getCategories, // Keep fetching flat list
    // Optionally fetch tree if preferred: fetchCategoryTree, categoryTree
  } = useContext(NoteContext);
  const { currentUser } = useContext(UserContext);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteTag, setNoteTag] = useState("");
  const [noteCategoryId, setNoteCategoryId] = useState("");
  const [noteIsFeatured, setNoteIsFeatured] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [areCategoriesLoading, setAreCategoriesLoading] = useState(false); // State for category loading

  const fetchCategoriesIfNeeded = useCallback(async () => {
    if (categories.length === 0) {
      setAreCategoriesLoading(true);
      try {
        await getCategories();
      } catch (err) {
        console.error("Failed to fetch categories for AddNote:", err);
        setError("Could not load categories. Please try refreshing.");
      } finally {
        setAreCategoriesLoading(false);
      }
    }
  }, [categories.length, getCategories]);

  useEffect(() => {
    fetchCategoriesIfNeeded();
  }, [fetchCategoriesIfNeeded]);

  const editor = useEditor({
    // ... (editor configuration remains the same)
    extensions: [
      StarterKit.configure({
        /* ... */
      }),
      Placeholder.configure({ placeholder: "Write your note here..." }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          /* ... */
        },
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        /* ... */
        class:
          "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none p-4 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 text-neutral dark:text-gray-200",
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
    setError("");
    setIsLoading(true);

    // --- Validation Checks ---
    if (!noteTitle || noteTitle.length < 3) {
      setError("Title must be at least 3 characters long.");
      setIsLoading(false);
      return;
    }
    if (
      !editorContent ||
      editorContent === "<p></p>" ||
      editor?.getText().trim().length < 5
    ) {
      setError("Description must be at least 5 characters long.");
      setIsLoading(false);
      return;
    }
    if (!noteCategoryId) {
      setError("Please select a category.");
      setIsLoading(false);
      return;
    }
    // --- End Validation ---

    try {
      const noteToAdd = {
        title: noteTitle,
        description: editorContent,
        tag: noteTag || "General",
        categoryId: noteCategoryId,
        isFeatured: noteIsFeatured,
      };

      // Only admin can set isFeatured on creation
      if (currentUser?.role !== "admin") {
        delete noteToAdd.isFeatured;
      }

      const response = await addNote(noteToAdd);

      if (response.success) {
        navigate("/my-notes");
      } else {
        setError(response.message || "Failed to add note. Please try again.");
      }
    } catch (err) {
      console.error("Add note error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Class Definitions ---
  const inputFieldClasses = "input-field mt-1";
  const labelClasses =
    "block text-sm font-medium text-neutral dark:text-gray-200";
  const errorTextClasses =
    "text-sm text-error text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-md my-4";
  const requiredMarkClasses = "text-error";
  const checkboxClasses = `h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 rounded`;
  // --- End Class Definitions ---

  // Generate hierarchical options for the dropdown
  const categoryOptions = generateCategoryOptions(categories);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="card w-full max-w-6xl">
        <h1 className="text-heading mb-6 text-center">Add New Note</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className={errorTextClasses}>{error}</div>}

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
              onChange={(e) => setNoteTitle(e.target.value)}
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
            <div className="mt-1 border-collapse">
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
                onChange={(e) => setNoteCategoryId(e.target.value)}
                className={inputFieldClasses}
                disabled={
                  isLoading || areCategoriesLoading || categories.length === 0
                }
              >
                <option value="" disabled>
                  {areCategoriesLoading
                    ? "Loading categories..."
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
                className={`ml-2 block text-sm font-medium text-neutral dark:text-gray-200`}
              >
                Mark as Featured (Admin Only)
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn-primary w-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !editor || areCategoriesLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Add Note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
