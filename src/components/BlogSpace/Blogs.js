import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../../context/notes/noteContext";
import Card from "./Card.js";
import "./Blogs.css";

function Blogs() {
  const context = useContext(noteContext);
  const { allNotes, getAllNotes } = context;

  useEffect(() => {
    getAllNotes();
  }, []);
  return (
    <div className="container-fluid">
      <h2>Blogs</h2>
      <div className="container mx-2">
        {allNotes.length === 0 && "No notes to display"}
      </div>
      <div className="allBlogs">
        {allNotes.map((note, i) => {
          return <Card data={note} key={i} />;
        })}
      </div>
    </div>
  );
}

export default Blogs;
