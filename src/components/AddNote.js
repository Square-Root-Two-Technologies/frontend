import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = () => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "Please select a topic",
    type: "JavaScript",
  });

  const handleClick = (e) => {
    e.preventDefault();
    console.log(note);
    addNote(note.title, note.description, note.tag, note.type);
    setNote({
      title: "",
      description: "",
      tag: "Please select a topic",
      type: "JavaScript",
    });
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="container my-3">
      <h2 style={{ color: "#ffffff" }}>Add a Note</h2>
      <form className="my-3">
        <div className="mb-3">
          <label
            htmlFor="title"
            className="form-label"
            style={{ color: "#ffffff" }}
          >
            Title
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
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="tag"
            className="form-label"
            style={{ color: "#ffffff" }}
          >
            Tag
          </label>
          <select
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={onChange}
            required
          >
            <option value="Please select a topic" disabled>
              Please select a topic
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
            style={{ color: "#ffffff" }}
          >
            Body
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={note.description}
            onChange={onChange}
            rows="5"
            required
          />
        </div>
        <button
          disabled={
            note.title.length < 5 ||
            note.description.length < 5 ||
            note.tag === "Please select a topic"
          }
          type="submit"
          className="btn btn-primary"
          onClick={handleClick}
          style={{ backgroundColor: "#a68a64", color: "#ffffff" }}
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
