import React, { useCallback } from "react";
import {
  FaBold, FaItalic, FaStrikethrough, FaCode, FaHeading,
  FaListUl, FaListOl, FaQuoteLeft, FaUndo, FaRedo,
  FaLink, FaImage, FaUnlink,
} from "react-icons/fa";

const MenuBar = ({ editor }) => {
  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  const btn = (type, opts = {}) => ({
    style: {
      padding: "0.375rem 0.5rem",
      borderRadius: "var(--radius)",
      border: "none",
      cursor: "pointer",
      fontSize: "0.875rem",
      lineHeight: 1,
      background: editor.isActive(type, opts) ? "var(--bg3)" : "transparent",
      color: editor.isActive(type, opts) ? "var(--accent)" : "var(--text2)",
      transition: "background var(--transition), color var(--transition)",
    },
  });

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "2px",
      padding: "0.5rem 0.75rem",
      background: "var(--bg3)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius) var(--radius) 0 0",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      {[
        { icon: <FaBold />, label: "Bold", action: () => editor.chain().focus().toggleBold().run(), type: "bold" },
        { icon: <FaItalic />, label: "Italic", action: () => editor.chain().focus().toggleItalic().run(), type: "italic" },
        { icon: <FaStrikethrough />, label: "Strike", action: () => editor.chain().focus().toggleStrike().run(), type: "strike" },
        { icon: <FaCode />, label: "Code", action: () => editor.chain().focus().toggleCode().run(), type: "code" },
      ].map(({ icon, label, action, type }) => (
        <button key={label} onClick={action} aria-label={label} {...btn(type)}>{icon}</button>
      ))}
      <div style={{ width: 1, background: "var(--border)", margin: "0 4px", alignSelf: "stretch" }} />
      {[
        { icon: <><FaHeading /><span style={{ fontSize: "0.65rem" }}>2</span></>, label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), type: "heading", opts: { level: 2 } },
        { icon: <><FaHeading /><span style={{ fontSize: "0.65rem" }}>3</span></>, label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), type: "heading", opts: { level: 3 } },
      ].map(({ icon, label, action, type, opts }) => (
        <button key={label} onClick={action} aria-label={label} {...btn(type, opts)}>{icon}</button>
      ))}
      <div style={{ width: 1, background: "var(--border)", margin: "0 4px", alignSelf: "stretch" }} />
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet list" {...btn("bulletList")}><FaListUl /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Ordered list" {...btn("orderedList")}><FaListOl /></button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} aria-label="Code block" {...btn("codeBlock")}><FaCode /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Quote" {...btn("blockquote")}><FaQuoteLeft /></button>
      <div style={{ width: 1, background: "var(--border)", margin: "0 4px", alignSelf: "stretch" }} />
      <button onClick={setLink} aria-label="Add link" {...btn("link")}><FaLink /></button>
      <button onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} aria-label="Remove link" style={{ ...btn("").style, opacity: editor.isActive("link") ? 1 : 0.4 }}><FaUnlink /></button>
      <button onClick={addImage} aria-label="Add image" {...btn("")}><FaImage /></button>
      <div style={{ width: 1, background: "var(--border)", margin: "0 4px", alignSelf: "stretch" }} />
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} aria-label="Undo" style={{ ...btn("").style, opacity: editor.can().undo() ? 1 : 0.35 }}><FaUndo /></button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} aria-label="Redo" style={{ ...btn("").style, opacity: editor.can().redo() ? 1 : 0.35 }}><FaRedo /></button>
    </div>
  );
};

export default MenuBar;
