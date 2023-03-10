import React, { useContext, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import JoditEditor from "jodit-react";

const AddNote = () => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const editor = useRef(null);

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
    type: "JavaScript",
  });

  const handleClick = (e) => {
    e.preventDefault();
    console.log(note);
    addNote(note.title, note.description, note.tag, note.type);
    setNote({ title: "", description: "", tag: "", type: "JavaScript" });
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  return (
    <div className="container my-3">
      <h2>Add a Note</h2>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            aria-describedby="emailHelp"
            value={note.title}
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Body
          </label>
          <JoditEditor
            ref={editor}
            name="description"
            value={note.description}
            onChange={(value) => {
              setNote({
                ...note,
                description: value, // Note: the name of the field is 'description'
              });
            }}
          />
        </div>

        <button
          disabled={note.title.length < 5 || note.description.length < 5}
          type="submit"
          className="btn btn-primary"
          onClick={handleClick}
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
