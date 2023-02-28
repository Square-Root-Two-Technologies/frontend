import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Blog = () => {
  const [note, setNote] = useState(null);
  const { id } = useParams();
  //const host = "http://localhost:5000";
  const host = process.env.REACT_APP_BACKEND;

  useEffect(() => {
    const getNoteById = async (id) => {
      const response = await fetch(
        `${host}/api/notes/fetchNotesIrrespective/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json = await response.json();
      console.log(json);
      setNote(json);
    };

    getNoteById(id);
  }, [id]);

  if (!note) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.description}</p>
      <p>Tag: {note.tag}</p>
      <p>Type: {note.type}</p>
      <p>Date: {note.date}</p>
    </div>
  );
};

export default Blog;
