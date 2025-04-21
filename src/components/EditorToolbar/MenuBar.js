// src/components/EditorToolbar/MenuBar.js
import React, { useCallback, useState } from "react";
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  CodeBracketIcon, // Renamed from CodeIcon (for inline)
  CodeBracketSquareIcon, // Added for Code Block
  Bars3BottomLeftIcon, // Renamed from HeadingIcon
  ListBulletIcon,
  QueueListIcon, // Renamed from ListOrderedIcon
  ChatBubbleLeftEllipsisIcon, // Renamed from QuoteIcon
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  LinkIcon,
  LinkSlashIcon,
} from "@heroicons/react/24/outline"; // Ensure these are correct v2 outline names

const MenuBar = ({ editor }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const buttonClass = (type, options = {}) =>
    `p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out relative group
     ${
       editor.isActive(type, options)
         ? "bg-gray-100 dark:bg-gray-700 text-primary"
         : "text-gray-600 dark:text-gray-300"
     }`;

  const tooltipClass =
    "absolute top-full mt-2 hidden group-hover:block text-xs bg-gray-800 dark:bg-gray-600 text-white rounded px-2 py-1 z-20 whitespace-nowrap"; // Added whitespace-nowrap

  const buttons = [
    {
      group: "Text Formatting",
      items: [
        {
          icon: <BoldIcon className="h-5 w-5" />,
          action: () => editor.chain().focus().toggleBold().run(),
          disabled: !editor.can().chain().focus().toggleBold().run(),
          active: "bold",
          label: "Bold",
        },
        {
          icon: <ItalicIcon className="h-5 w-5" />,
          action: () => editor.chain().focus().toggleItalic().run(),
          disabled: !editor.can().chain().focus().toggleItalic().run(),
          active: "italic",
          label: "Italic",
        },
        {
          icon: <StrikethroughIcon className="h-5 w-5" />,
          action: () => editor.chain().focus().toggleStrike().run(),
          disabled: !editor.can().chain().focus().toggleStrike().run(),
          active: "strike",
          label: "Strikethrough",
        },
        {
          icon: <CodeBracketIcon className="h-5 w-5" />, // Use correct icon
          action: () => editor.chain().focus().toggleCode().run(),
          disabled: !editor.can().chain().focus().toggleCode().run(),
          active: "code",
          label: "Inline Code",
        },
      ],
    },
    {
      group: "Structure",
      items: [
        {
          icon: (
            <span className="flex items-center">
              <Bars3BottomLeftIcon className="h-5 w-5" />{" "}
              {/* Use correct icon */}
              <span className="text-xs font-bold ml-0.5">H2</span>
            </span>
          ),
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          active: "heading",
          activeOptions: { level: 2 },
          label: "Heading 2",
        },
        {
          icon: (
            <span className="flex items-center">
              <Bars3BottomLeftIcon className="h-5 w-5" />{" "}
              {/* Use correct icon */}
              <span className="text-xs font-bold ml-0.5">H3</span>
            </span>
          ),
          action: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          active: "heading",
          activeOptions: { level: 3 },
          label: "Heading 3",
        },
        {
          icon: <ListBulletIcon className="h-5 w-5" />,
          action: () => editor.chain().focus().toggleBulletList().run(),
          active: "bulletList",
          label: "Bullet List",
        },
        {
          icon: <QueueListIcon className="h-5 w-5" />, // Use correct icon
          action: () => editor.chain().focus().toggleOrderedList().run(),
          active: "orderedList",
          label: "Ordered List",
        },
        {
          icon: <CodeBracketSquareIcon className="h-5 w-5" />, // Use correct icon for block
          action: () => editor.chain().focus().toggleCodeBlock().run(),
          active: "codeBlock",
          label: "Code Block",
        },
        {
          icon: <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />, // Use correct icon
          action: () => editor.chain().focus().toggleBlockquote().run(),
          active: "blockquote",
          label: "Blockquote",
        },
      ],
    },
    {
      group: "Links",
      items: [
        {
          icon: <LinkIcon className="h-5 w-5" />,
          action: setLink,
          active: "link", // Check link activity
          label: "Set/Edit Link",
        },
        {
          icon: <LinkSlashIcon className="h-5 w-5" />,
          action: () => editor.chain().focus().unsetLink().run(),
          disabled: !editor.isActive("link"),
          // No active state needed here, it's an action based on link presence
          label: "Unset Link",
        },
      ],
    },
    {
      group: "History",
      items: [
        {
          icon: <ArrowUturnLeftIcon className="h-5 w-5" />,
          action: () => editor.chain().focus().undo().run(),
          disabled: !editor.can().chain().focus().undo().run(),
          label: "Undo",
        },
        {
          icon: <ArrowUturnRightIcon className="h-5 w-5" />,
          action: () => editor.chain().focus().redo().run(),
          disabled: !editor.can().chain().focus().redo().run(),
          label: "Redo",
        },
      ],
    },
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
      {/* Desktop Menu */}
      <div className="hidden sm:flex flex-wrap gap-x-1 gap-y-1 p-2">
        {" "}
        {/* Reduced gap */}
        {buttons.map((group, groupIdx) => (
          <React.Fragment key={group.group}>
            {groupIdx > 0 && (
              <div className="border-l border-gray-300 dark:border-gray-600 mx-1 h-6 self-center"></div>
            )}{" "}
            {/* Separator */}
            <div className="flex gap-x-0.5">
              {" "}
              {/* Reduced gap */}
              {group.items.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={btn.action}
                  disabled={btn.disabled}
                  className={`${buttonClass(btn.active, btn.activeOptions)} ${
                    btn.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  aria-label={btn.label}
                  title={btn.label} // Add title for tooltips
                >
                  {btn.icon}
                  <span className={tooltipClass}>{btn.label}</span>
                </button>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="sm:hidden flex justify-between items-center p-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Editor Toolbar
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label="Toggle toolbar"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2">
          {buttons.map((group) => (
            <div key={group.group} className="mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase pl-1">
                {group.group}
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {group.items.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      btn.action();
                      setIsMobileMenuOpen(false);
                    }} // Close menu on action
                    disabled={btn.disabled}
                    className={`flex items-center flex-grow basis-1/3 ${buttonClass(
                      btn.active,
                      btn.activeOptions,
                    )} ${btn.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label={btn.label}
                  >
                    {btn.icon}
                    <span className="ml-2 text-sm">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuBar;
