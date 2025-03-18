import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./NoteItem/NoteItem.js";
import AddNote from "./AddNote";

const Notes2 = () => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;

  const [showAddModal, setShowAddModal] = useState(false);
  const modalRef = useRef(null);
  const addModalRef = useRef(null);
  const [modalInstance, setModalInstance] = useState(null);
  const [addModalInstance, setAddModalInstance] = useState(null);
  const refClose = useRef(null);

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  useEffect(() => {
    getNotes();
    // Edit modal
    const modalElement = modalRef.current;
    if (modalElement) {
      const instance = new Modal(modalElement);
      setModalInstance(instance);
    }
    // Add modal
    const addModalElement = addModalRef.current;
    if (addModalElement) {
      const addInstance = new Modal(addModalElement);
      setAddModalInstance(addInstance);
    }
    // eslint-disable-next-line
  }, []);

  const updateNote = (currentNote) => {
    if (modalInstance) {
      modalInstance.show();
    }
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  const handleClick = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const toggleAddModal = () => {
    if (addModalInstance) {
      showAddModal ? addModalInstance.hide() : addModalInstance.show();
      setShowAddModal(!showAddModal);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: "1 0 auto" }}>
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h1
              style={{
                color: "#f4e3d3",
                fontSize: "2.5rem",
                margin: 0,
              }}
            >
              Your Note Manager
            </h1>
            <button
              className="btn"
              onClick={toggleAddModal}
              style={{
                backgroundColor: "#a68a64",
                color: "#ffffff",
                border: "none",
                padding: "8px 20px",
                fontSize: "1rem",
                borderRadius: "5px",
                transition: "background-color 0.3s ease",
              }}
            >
              Add a Note
            </button>
          </div>

          {/* Notes Grid */}
          <div className="container mb-5">
            <h2
              style={{
                color: "#f4e3d3",
                fontSize: "2rem",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              Your Notes
            </h2>
            <div className="row g-4">
              {notes.length === 0 ? (
                <div className="col-12">
                  <div
                    style={{
                      backgroundColor: "#3c3c3c",
                      color: "#d9b8a2",
                      border: "none",
                      padding: "1.5rem",
                      borderRadius: "5px",
                      textAlign: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    No notes to display. Start by adding a note!
                  </div>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                    key={note._id}
                  >
                    <Noteitem updateNote={updateNote} note={note} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Edit Note Modal */}
          <div
            className="modal fade"
            id="editModal"
            ref={modalRef}
            tabIndex="-1"
            aria-labelledby="editModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                style={{ backgroundColor: "#2b2b2b", border: "none" }}
                className="modal-content"
              >
                <div
                  style={{ backgroundColor: "#a68a64", color: "#ffffff" }}
                  className="modal-header"
                >
                  <h5 className="modal-title" id="editModalLabel">
                    Edit Your Note
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    style={{ filter: "invert(1)" }}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="my-3">
                    <div className="mb-3">
                      <label
                        htmlFor="etitle"
                        style={{ color: "#f4e3d3" }}
                        className="form-label"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="etitle"
                        name="etitle"
                        value={note.etitle}
                        onChange={onChange}
                        minLength={5}
                        required
                        style={{
                          backgroundColor: "#3c3c3c",
                          color: "#f4e3d3",
                          border: "none",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="etag"
                        style={{ color: "#f4e3d3" }}
                        className="form-label"
                      >
                        Tag (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="etag"
                        name="etag"
                        value={note.etag}
                        onChange={onChange}
                        style={{
                          backgroundColor: "#3c3c3c",
                          color: "#f4e3d3",
                          border: "none",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="edescription"
                        style={{ color: "#f4e3d3" }}
                        className="form-label"
                      >
                        Body
                      </label>
                      <textarea
                        className="form-control"
                        id="edescription"
                        name="edescription"
                        value={note.edescription}
                        onChange={onChange}
                        minLength={5}
                        required
                        rows="4"
                        style={{
                          backgroundColor: "#3c3c3c",
                          color: "#f4e3d3",
                          border: "none",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    ref={refClose}
                    type="button"
                    className="btn"
                    data-bs-dismiss="modal"
                    style={{
                      backgroundColor: "#6c757d",
                      color: "#ffffff",
                      border: "none",
                      padding: "5px 15px",
                      borderRadius: "5px",
                    }}
                  >
                    Close
                  </button>
                  <button
                    disabled={
                      note.etitle.length < 5 || note.edescription.length < 5
                    }
                    onClick={handleClick}
                    type="button"
                    className="btn"
                    style={{
                      backgroundColor: "#a68a64",
                      color: "#ffffff",
                      border: "none",
                      padding: "5px 15px",
                      borderRadius: "5px",
                    }}
                  >
                    Update Note
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Note Modal */}
          <div
            className="modal fade"
            id="addModal"
            ref={addModalRef}
            tabIndex="-1"
            aria-labelledby="addModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                style={{ backgroundColor: "#2b2b2b", border: "none" }}
                className="modal-content"
              >
                <div
                  style={{ backgroundColor: "#a68a64", color: "#ffffff" }}
                  className="modal-header"
                >
                  <h5 className="modal-title" id="addModalLabel">
                    Create a New Note
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={toggleAddModal}
                    style={{ filter: "invert(1)" }}
                  ></button>
                </div>
                <div className="modal-body">
                  <AddNote />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer
        className="text-center py-3"
        style={{ backgroundColor: "#1a1a1a", color: "#ffffff", flexShrink: 0 }}
      >
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Note Manager</p>
      </footer>
    </div>
  );
};

export default Notes2;
