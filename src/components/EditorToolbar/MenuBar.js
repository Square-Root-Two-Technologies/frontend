// src/components/EditorToolbar/MenuBar.js
import React, { useCallback } from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaLink,
  FaImage,
  FaUnlink,
} from "react-icons/fa";

const MenuBar = ({ editor }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Placeholder for image handling - Triggers the AddNote component's logic
  const addImage = () => {
    // In a real app, you would trigger a file input or modal here
    // Upload the image, get the URL, then call editor.chain().focus().setImage({ src: URL }).run()
    const url = window.prompt("Enter Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    console.warn(
      "Image upload logic needs to be implemented in AddNote component!",
    );
  };

  if (!editor) {
    return null;
  }

  const buttonClass = (type, options = {}) =>
    `p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out
     ${
       editor.isActive(type, options)
         ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
         : "text-gray-700 dark:text-gray-300"
     }`;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg p-2 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-1 sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass("bold")}
        aria-label="Bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass("italic")}
        aria-label="Italic"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={buttonClass("strike")}
        aria-label="Strikethrough"
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={buttonClass("code")}
        aria-label="Inline Code"
      >
        <FaCode />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass("heading", { level: 2 })}
        aria-label="Heading 2"
      >
        <FaHeading /> <span className="text-xs">2</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass("heading", { level: 3 })}
        aria-label="Heading 3"
      >
        <FaHeading /> <span className="text-xs">3</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass("bulletList")}
        aria-label="Bullet List"
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass("orderedList")}
        aria-label="Ordered List"
      >
        <FaListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass("codeBlock")}
        aria-label="Code Block"
      >
        <FaCode /> Block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass("blockquote")}
        aria-label="Blockquote"
      >
        <FaQuoteLeft />
      </button>
      <button
        onClick={setLink}
        className={buttonClass("link")}
        aria-label="Set Link"
        disabled={editor.isActive("link") && !editor.can().unsetLink()} // Disable if link active and cannot unset
      >
        <FaLink />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        className={buttonClass("link") + " disabled:opacity-50"} // Basic disabled style
        aria-label="Unset Link"
      >
        <FaUnlink />
      </button>
      <button
        onClick={addImage}
        className={buttonClass("")}
        aria-label="Add Image"
      >
        <FaImage />
      </button>
      {/* Add more buttons as needed */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
        aria-label="Undo"
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
        aria-label="Redo"
      >
        <FaRedo />
      </button>
    </div>
  );
};

export default MenuBar;
