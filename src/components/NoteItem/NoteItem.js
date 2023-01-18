import React, { useContext } from "react";
import noteContext from "../../context/notes/noteContext";
import "./NoteItem.css";

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;
  return (
    <div className="blogCard">
      <div className="blogContainer">
        <h5 className="blogTitle">{note.title}</h5>
        <p className="blogDescription">{note.description}</p>
        <div
          onClick={() => {
            deleteNote(note._id);
          }}
          className="btn btn-primary mx-2"
        >
          delete
        </div>
        <div
          onClick={() => {
            updateNote(note);
          }}
          className="btn btn-primary mx-2"
        >
          edit
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
