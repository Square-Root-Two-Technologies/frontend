import NoteContext from "./noteContext";
import { useState } from "react";
import React from "react";

const NoteState = (props) => {
  //const host = "http://localhost:5000";
  const host = process.env.REACT_APP_BACKEND;
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  //get note by id
  const getNote = async (id) => {
    const response = await fetch(`${host}/api/notes/fetchNotesIrrespective`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  // get all notes irrespective of user
  const allNotesInitial = [];
  const [allNotes, setAllNotes] = useState(allNotesInitial);
  const getAllNotes = async () => {
    // API Call
    const response = await fetch(`${host}/api/notes/fetchNotesIrrespective`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    setAllNotes(json);
  };

  // Get all Notes
  const getNotes = async () => {
    console.log(localStorage.getItem("token"));
    // API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  //get note by type
  const notesByFilterInitial = [];
  const [notesByFilter, setNotesByFilter] = useState(notesByFilterInitial);

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
      setNotesByFilter(note); // Corrected: update notesByFilter state instead of notes state
    } catch (error) {
      console.log(error);
    }
  };

  //Get note by id
  const noteByIdInitial = null;
  const [note, setNote] = useState(noteByIdInitial);
  const getNoteById = async (id) => {
    // TODO: API Call
    // API Call
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
    setNote(json);
  };

  // Add a Note
  const addNote = async (title, description, tag, type) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, description, tag, type }),
      });

      const note = await response.json();
      setNotes(notes.concat(note));
    } catch (error) {
      console.error(error.message);
      // TODO: Display an error message to the user
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = response.json();
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();

    let newNotes = JSON.parse(JSON.stringify(notes));
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        deleteNote,
        editNote,
        getNotes,
        allNotes,
        getAllNotes,
        notesByFilter,
        getNotesByType,
        note,
        getNoteById,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
