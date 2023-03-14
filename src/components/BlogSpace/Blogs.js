import React, { useContext, useEffect, useState } from "react";
import noteContext from "../../context/notes/noteContext";
import { useNavigate } from "react-router-dom";
import coder from "./assets/coder.png";
import "./Blogs.css";

function Blogs({ selectedOption }) {
  //const host = "http://localhost:5000";
  const host = process.env.REACT_APP_BACKEND;
  // add selectedOption as a prop
  const context = useContext(noteContext);
  const [notesByFilter, setNotesByFilter] = useState([]); // initialize notesByFilter state
  const navigate = useNavigate();

  useEffect(() => {
    console.log("selectedOption: ", selectedOption);
    getNotesByType(selectedOption);
  }, [selectedOption]);

  //get note by type
  const getNotesByType = async (type) => {
    try {
      const response = await fetch(
        `${host}/api/notes/fetchNotesIrrespectiveByType/${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const note = await response.json();
      setNotesByFilter(note); // update notesByFilter state with fetched notes
    } catch (error) {
      console.log(error);
    }
  };

  // handle click on Read button
  const handleReadClick = (id) => {
    navigate(`/blog/${id}`);
  };

  // render notes based on selected option or all notes
  const renderNotes = () => {
    const notes = notesByFilter;
    if (notes.length === 0) {
      return <div>No blogs to display</div>;
    } else {
      return (
        <div className="allBlogs">
          {notes.map((note, i) => {
            return (
              <div className="card" style={{ width: "18rem" }} key={i}>
                <img className="card-img-top" src={coder} alt="Card cap" />
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <button
                    type="button"
                    className="btn btn-primary my-3"
                    onClick={() => handleReadClick(note._id)}
                  >
                    Read
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <>
      <div className="container-fluid">
        <h2>Blogs</h2>
        <div className="container mx-2">{renderNotes()}</div>
      </div>
    </>
  );
}

export default Blogs;
