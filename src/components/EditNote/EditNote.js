import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import noteContext from "../../context/notes/noteContext";
import JoditEditor from "jodit-react";

const EditNote = ({ note: initialNote, onSave, onClose }) => {
  const context = useContext(noteContext);
  const { editNote } = context;

  const [note, setNote] = useState({
    id: "",
    title: "",
    description: "",
    tag: "Please select a topic",
    type: "JavaScript",
  });

  const editorRef = useRef(null);

  // Sync internal state with incoming note prop whenever it changes
  useEffect(() => {
    setNote({
      id: initialNote.id || "",
      title: initialNote.etitle || initialNote.title || "",
      description: initialNote.edescription || initialNote.description || "",
      tag: initialNote.etag || initialNote.tag || "Please select a topic",
      type: "JavaScript", // Adjust if type is dynamic
    });
  }, [initialNote]);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      editNote(note.id, note.title, note.description, note.tag);
      onSave();
    },
    [editNote, note, onSave],
  );

  const onChange = (e) => {
    setNote((prevNote) => ({
      ...prevNote,
      [e.target.name]: e.target.value,
    }));
  };

  const onEditorBlur = (newContent) => {
    setNote((prevNote) => ({
      ...prevNote,
      description: newContent,
    }));
  };

  const editorConfig = {
    height: 500,
    theme: "dark",
    toolbarSticky: true,
    placeholder: "Edit your blog post here...",
    style: {
      backgroundColor: "#3c3c3c",
      color: "#f4e3d3",
      border: "none",
    },
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "fontsize",
      "font",
      "|",
      "ul",
      "ol",
      "indent",
      "outdent",
      "|",
      "link",
      "image",
      "video",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "table",
      "source",
    ],
    extraButtons: [
      {
        name: "fullsize",
        tooltip: "Full Screen",
      },
    ],
  };

  return (
    <div className="container my-3" style={{ maxWidth: "100%" }}>
      <h2 style={{ color: "#ffffff", fontSize: "1.75rem" }}>Edit Blog Post</h2>
      <form className="my-3" onSubmit={handleSave}>
        <div className="mb-3">
          <label
            htmlFor="title"
            className="form-label"
            style={{ color: "#f4e3d3", fontSize: "1.1rem" }}
          >
            Blog Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={note.title}
            onChange={onChange}
            minLength={5}
            required
            style={{
              backgroundColor: "#3c3c3c",
              color: "#f4e3d3",
              border: "none",
              fontSize: "1rem",
            }}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="tag"
            className="form-label"
            style={{ color: "#f4e3d3", fontSize: "1.1rem" }}
          >
            Category
          </label>
          <select
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={onChange}
            required
            style={{
              backgroundColor: "#3c3c3c",
              color: "#f4e3d3",
              border: "none",
              fontSize: "1rem",
            }}
          >
            <option value="Please select a topic" disabled>
              Please select a category
            </option>
            <option value="all">All Topics</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Salesforce">Salesforce</option>
            <option value="Sociology">Sociology</option>
            <option value="Other Topics">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label
            htmlFor="description"
            className="form-label"
            style={{ color: "#f4e3d3", fontSize: "1.1rem" }}
          >
            Blog Content
          </label>
          <JoditEditor
            ref={editorRef}
            value={note.description}
            config={editorConfig}
            onBlur={onEditorBlur}
            tabIndex={1}
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn"
            onClick={onClose}
            style={{
              backgroundColor: "#6c757d",
              color: "#ffffff",
              border: "none",
              padding: "8px 20px",
              borderRadius: "5px",
              fontSize: "1rem",
            }}
          >
            Close
          </button>
          <button
            type="submit"
            className="btn"
            disabled={
              note.title.length < 5 ||
              note.description.length < 5 ||
              note.tag === "Please select a topic"
            }
            style={{
              backgroundColor: "#a68a64",
              color: "#ffffff",
              border: "none",
              padding: "8px 20px",
              borderRadius: "5px",
              fontSize: "1rem",
            }}
          >
            Update Blog Post
          </button>
        </div>
      </form>
    </div>
  );
};

EditNote.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string,
    etitle: PropTypes.string,
    edescription: PropTypes.string,
    etag: PropTypes.string,
    title: PropTypes.string, // Added for compatibility
    description: PropTypes.string, // Added for compatibility
    tag: PropTypes.string, // Added for compatibility
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditNote;
