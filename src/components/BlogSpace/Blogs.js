import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../../context/notes/noteContext";
import Card from "./Card.js";
import "./Blogs.css";

function Blogs() {
  const context = useContext(noteContext);
  const { notes, getAllNotes } = context;
  useEffect(() => {
    getAllNotes();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container-fluid">
      <h2>Blogs</h2>
      <div className="container mx-2">
        {notes.length === 0 && "No notes to display"}
      </div>
      <div className="allBlogs">
        {notes.map((note, i) => {
          return <Card data={note} key={i} />;
        })}
      </div>
    </div>
  );
}

export default Blogs;
