import React, { useContext, useState } from "react";
import noteContext from "../../context/notes/noteContext";
import "./NoteItem.css";

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteNote(note._id);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className="blogCard">
        <div className="blogContainer">
          <h5 className="blogTitle" style={{ color: "#f4e3d3" }}>
            {note.title}
          </h5>
          <p className="blogDescription" style={{ color: "#d9b8a2" }}>
            {note.description}
          </p>
          <div className="d-flex justify-content-between flex-wrap gap-2">
            <button
              onClick={handleDelete}
              className="btn"
              style={{
                backgroundColor: "#dc3545", // Red for delete, consistent with Bootstrap danger
                color: "#ffffff",
                border: "none",
                padding: "5px 15px",
                borderRadius: "5px",
              }}
            >
              Delete
            </button>
            <button
              onClick={() => updateNote(note)}
              className="btn"
              style={{
                backgroundColor: "#a68a64",
                color: "#ffffff",
                border: "none",
                padding: "5px 15px",
                borderRadius: "5px",
              }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{ backgroundColor: "#2b2b2b" }}
            >
              <div
                className="modal-header"
                style={{ backgroundColor: "#dc3545", color: "#ffffff" }} // Red header for delete
              >
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelDelete}
                  style={{ filter: "invert(1)" }}
                ></button>
              </div>
              <div className="modal-body" style={{ color: "#f4e3d3" }}>
                <p>Are you sure you want to delete "{note.title}"?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={cancelDelete}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "#ffffff",
                    border: "none",
                    padding: "5px 15px",
                    borderRadius: "5px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={confirmDelete}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#ffffff",
                    border: "none",
                    padding: "5px 15px",
                    borderRadius: "5px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Noteitem;
