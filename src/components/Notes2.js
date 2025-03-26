import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./NoteItem/NoteItem.js";
import AddNote from "./AddNote";
import EditNote from "./EditNote/EditNote.js";

const Notes2 = () => {
  const context = useContext(noteContext);
  const { notes, getNotes } = context;

  const [showAddModal, setShowAddModal] = useState(false);
  const modalRef = useRef(null);
  const addModalRef = useRef(null);
  const [modalInstance, setModalInstance] = useState(null);
  const [addModalInstance, setAddModalInstance] = useState(null);

  const [note, setNote] = useState({
    id: "",
    title: "", // Changed to match EditNote
    description: "", // Changed to match EditNote
    tag: "", // Changed to match EditNote
  });

  useEffect(() => {
    getNotes();
    const modalElement = modalRef.current;
    if (modalElement) {
      const instance = new Modal(modalElement);
      setModalInstance(instance);
    }
    const addModalElement = addModalRef.current;
    if (addModalElement) {
      const addInstance = new Modal(addModalElement);
      setAddModalInstance(addInstance);
    }
    // eslint-disable-next-line
  }, []);

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      title: currentNote.title, // Use consistent field names
      description: currentNote.description,
      tag: currentNote.tag || "Please select a topic",
    });
    if (modalInstance) {
      modalInstance.show();
    }
  };

  const toggleAddModal = () => {
    if (addModalInstance) {
      showAddModal ? addModalInstance.hide() : addModalInstance.show();
      setShowAddModal(!showAddModal);
    }
  };

  const handleSaveEdit = () => {
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  const handleCloseEdit = () => {
    if (modalInstance) {
      modalInstance.hide();
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
              Your Blog Manager
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
              Add a Blog Post
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
              Your Blog Posts
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
                    No blog posts to display. Start by adding one!
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
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              style={{ maxWidth: "90vw", width: "100%" }}
            >
              <div
                style={{ backgroundColor: "#2b2b2b", border: "none" }}
                className="modal-content"
              >
                <div
                  style={{ backgroundColor: "#a68a64", color: "#ffffff" }}
                  className="modal-header"
                >
                  <h5 className="modal-title" id="editModalLabel">
                    Edit Your Blog Post
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseEdit}
                    style={{ filter: "invert(1)" }}
                  ></button>
                </div>
                <div className="modal-body" style={{ padding: "1.5rem" }}>
                  <EditNote
                    note={note}
                    onSave={handleSaveEdit}
                    onClose={handleCloseEdit}
                  />
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
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              style={{ maxWidth: "90vw", width: "100%" }}
            >
              <div
                style={{ backgroundColor: "#2b2b2b", border: "none" }}
                className="modal-content"
              >
                <div
                  style={{ backgroundColor: "#a68a64", color: "#ffffff" }}
                  className="modal-header"
                >
                  <h5 className="modal-title" id="addModalLabel">
                    Create a New Blog Post
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={toggleAddModal}
                    style={{ filter: "invert(1)" }}
                  ></button>
                </div>
                <div className="modal-body" style={{ padding: "1.5rem" }}>
                  <AddNote toggleAddModal={toggleAddModal} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes2;
