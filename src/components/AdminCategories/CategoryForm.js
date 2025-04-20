// Inside your CategoryForm component (for Admin Add/Edit)
import React, { useState, useEffect, useContext } from "react";
import NoteContext from "../../context/Notes/NoteContext";

const CategoryForm = ({ categoryToEdit, onSave }) => {
  const { categories, getCategories } = useContext(NoteContext); // Assuming flat list is fetched here
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState(""); // Use empty string for "None"

  useEffect(() => {
    if (categories.length === 0) {
      getCategories(); // Fetch if needed
    }
    if (categoryToEdit) {
      setName(categoryToEdit.name || "");
      setDescription(categoryToEdit.description || "");
      setParentId(categoryToEdit.parent?._id || categoryToEdit.parent || ""); // Handle populated or ID parent
    } else {
      // Reset form for adding new
      setName("");
      setDescription("");
      setParentId("");
    }
  }, [categoryToEdit, categories.length, getCategories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      description,
      parent: parentId || null, // Send null if empty string selected
    });
  };

  // Filter out the category being edited from the parent options
  const parentOptions = categories.filter(
    (cat) => !categoryToEdit || cat._id !== categoryToEdit._id,
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Name Input */}
      <div>
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
          rows="3"
        />
      </div>

      {/* Parent Category Select */}
      <div>
        <label htmlFor="parent">Parent Category</label>
        <select
          id="parent"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="input-field"
        >
          <option value="">-- None (Top Level) --</option>
          {parentOptions.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary mt-4">
        {categoryToEdit ? "Update Category" : "Add Category"}
      </button>
    </form>
  );
};

export default CategoryForm;
