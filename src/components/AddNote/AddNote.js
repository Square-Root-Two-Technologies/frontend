import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

// Tiptap Imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import MenuBar from "../EditorToolbar/MenuBar";

const AddNote = () => {
  const navigate = useNavigate();
  const { addNote } = useContext(NoteContext);
  const { currentUser } = useContext(UserContext);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteTag, setNoteTag] = useState("");
  const [noteType, setNoteType] = useState("");
  const [noteIsFeatured, setNoteIsFeatured] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Tiptap Editor Setup ---
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class:
              "bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm font-mono overflow-x-auto",
          },
        },
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Placeholder.configure({
        placeholder: "Write your note here...",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "max-w-full h-auto my-4 rounded",
        },
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Increased responsive min-height for the editor
        class:
          "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none p-4 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 text-neutral dark:text-gray-200",
      },
    },
  });
  // --- End Tiptap Setup ---

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!noteTitle || noteTitle.length < 3) {
      setError("Title must be at least 3 characters long.");
      setIsLoading(false);
      return;
    }
    if (
      !editorContent ||
      editorContent === "<p></p>" ||
      editor.getText().trim().length < 5
    ) {
      setError("Description must be at least 5 characters long.");
      setIsLoading(false);
      return;
    }
    if (!noteType) {
      setError("Please select a note type.");
      setIsLoading(false);
      return;
    }

    try {
      const noteToAdd = {
        title: noteTitle,
        description: editorContent,
        tag: noteTag || "General",
        type: noteType,
      };

      if (currentUser?.role === "admin") {
        noteToAdd.isFeatured = noteIsFeatured;
      }

      const response = await addNote(noteToAdd);

      if (response.success) {
        navigate("/my-notes");
      } else {
        setError(response.message || "Failed to add note. Please try again.");
      }
    } catch (err) {
      console.error("Add note error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Input field classes
  const inputFieldClasses = "input-field mt-1";
  const labelClasses =
    "block text-sm font-medium text-neutral dark:text-gray-200";
  const errorTextClasses =
    "text-sm text-error text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-md my-4";
  const requiredMarkClasses = "text-error";
  const checkboxClasses = `h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 rounded`;

  return (
    // --- Updated Outer Container ---
    // Takes minimum screen height, uses flexbox to center the card vertically and horizontally
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* --- Updated Card Container --- */}
      {/* Tries to take full width up to a larger max-width */}
      <div className="card w-full max-w-6xl">
        {" "}
        {/* Increased max-width */}
        <h1 className="text-heading mb-6 text-center">Add New Note</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className={errorTextClasses}>{error}</div>}

          {/* Title Field */}
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

          {/* Description Field (Tiptap Editor) */}
          <div>
            <label htmlFor="description" className={labelClasses}>
              Description <span className={requiredMarkClasses}>*</span>
            </label>
            <div className="mt-1 border-collapse">
              <MenuBar editor={editor} />
              {/* Note: Editor height is controlled via editorProps */}
              <EditorContent editor={editor} id="description" />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use the toolbar above to format your text.
            </p>
          </div>

          {/* --- Row for Type and Tag --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Select */}
            <div>
              <label htmlFor="type" className={labelClasses}>
                Type <span className={requiredMarkClasses}>*</span>
              </label>
              <select
                name="type"
                id="type"
                required
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className={inputFieldClasses}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select a type
                </option>
                <option value="JavaScript">JavaScript</option>
                <option value="Salesforce">Salesforce</option>
                <option value="Sociology">Sociology</option>
                <option value="Life">Life</option>
                <option value="Technology">Technology</option>
                <option value="Creative">Creative</option>
                <option value="Tutorial">Tutorial</option>
                <option value="News">News</option>
              </select>
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
                placeholder="e.g., React, ProjectX"
                disabled={isLoading}
              />
            </div>
          </div>
          {/* --- End Row --- */}

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
            disabled={isLoading || !editor}
          >
            {isLoading ? <LoadingSpinner /> : "Add Note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
