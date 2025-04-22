import React, { useState, useEffect, useContext } from "react";
// import NoteContext from "../../context/Notes/NoteContext"; // *** REMOVED ***
import CategoryContext from "../../context/category/CategoryContext"; // *** NEW ***

const CategoryForm = ({ categoryToEdit, onSave }) => {
  // Get categories list and fetch function from CategoryContext
  const { categories, getCategories } = useContext(CategoryContext); // *** UPDATED ***

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState(""); // Use empty string for "None" option

  // Effect to populate form when categoryToEdit changes or categories load
  useEffect(() => {
    // Ensure categories are loaded if needed (might be redundant if AdminPage ensures load)
    if (categories.length === 0) {
      getCategories(); // Use function from CategoryContext
    }

    // Populate form based on props
    if (categoryToEdit) {
      setName(categoryToEdit.name || "");
      setDescription(categoryToEdit.description || "");
      // Handle parent being an object or just an ID string if necessary
      setParentId(categoryToEdit.parent?._id || categoryToEdit.parent || "");
    } else {
      // Reset form for adding new
      setName("");
      setDescription("");
      setParentId("");
    }
  }, [categoryToEdit, categories.length, getCategories]); // Update dependencies

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      description,
      parent: parentId || null, // Send null if parentId is empty string
    });
    // Consider resetting form fields here if needed after successful save
    // setName(''); setDescription(''); setParentId('');
  };

  // Filter out the category being edited from parent options
  const parentOptions = categories.filter(
    (cat) => !categoryToEdit || cat._id !== categoryToEdit._id,
  );

  // --- Render Logic ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {" "}
      {/* Added spacing */}
      {/* Name Input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name *
        </label>{" "}
        {/* Assuming label style */}
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field mt-1" // Assuming .input-field
        />
      </div>
      {/* Description Textarea */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field mt-1" // Assuming .input-field
          rows="3"
        />
      </div>
      {/* Parent Category Select */}
      <div>
        <label
          htmlFor="parent"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Parent Category
        </label>
        <select
          id="parent"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="input-field mt-1" // Assuming .input-field
          // Disable if categories haven't loaded? Optional.
          // disabled={categories.length === 0}
        >
          <option value="">-- None (Top Level) --</option>
          {/* Map options using CategoryContext data */}
          {parentOptions.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {/* Add indentation logic here if needed, based on tree structure or level property */}
              {cat.name}
            </option>
          ))}
        </select>
        {/* Optional: Show loading indicator if categories are still fetching */}
        {/* {isFetchingCategories && <LoadingSpinner size="sm"/>} */}
      </div>
      {/* Submit Button */}
      <button type="submit" className="btn-primary mt-4">
        {" "}
        {/* Assuming .btn-primary */}
        {categoryToEdit ? "Update Category" : "Add Category"}
      </button>
    </form>
  );
};

export default CategoryForm;
