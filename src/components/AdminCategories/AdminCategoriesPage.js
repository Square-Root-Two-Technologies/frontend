// src/components/AdminCategories/AdminCategoriesPage.js
import React, { useState, useEffect, useContext, useCallback } from "react";
import NoteContext from "../../context/Notes/NoteContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CategoryForm from "./CategoryForm"; // Use the existing form
import { FaEdit, FaPlus } from "react-icons/fa";

// --- Helper Component to Render the Tree Nodes ---
const AdminCategoryTreeNode = ({ node, onEdit, onAddSub }) => {
  const [isOpen, setIsOpen] = useState(false); // <-- Add this line
  const hasChildren = node.children && node.children.length > 0;

  if (!node) return null;

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(node);
  };

  const handleAddSubClick = (e) => {
    e.stopPropagation();
    onAddSub(node); // Pass the parent node
  };

  return (
    <li className="my-1">
      <div className="flex items-center justify-between group p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        <div className="flex items-center flex-grow min-w-0 mr-2">
          {/* Indentation and Toggle */}
          <span className="inline-block w-6 flex-shrink-0 text-center">
            {hasChildren ? (
              <button
                onClick={toggleOpen}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-expanded={isOpen}
                aria-label={isOpen ? "Collapse" : "Expand"}
              >
                {isOpen ? "▼" : "▶"}
              </button>
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                •
              </span>
            )}
          </span>
          {/* Category Name */}
          <span
            className="ml-1 text-neutral dark:text-gray-200 truncate"
            title={node.name}
          >
            {node.name}
          </span>
          {node.description && (
            <span
              className="ml-2 text-xs text-subtle truncate hidden md:inline"
              title={node.description}
            >
              ({node.description})
            </span>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEditClick}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title={`Edit ${node.name}`}
          >
            <FaEdit />
          </button>
          <button
            onClick={handleAddSubClick}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title={`Add subcategory under ${node.name}`}
          >
            <FaPlus />
          </button>
        </div>
      </div>
      {/* Render Children */}
      {hasChildren && isOpen && (
        <ul className="pl-6 border-l border-dashed border-gray-300 dark:border-gray-600 ml-3">
          {node.children.map((child) => (
            <AdminCategoryTreeNode
              key={child._id}
              node={child}
              onEdit={onEdit}
              onAddSub={onAddSub}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// --- Main Page Component ---
const AdminCategoriesPage = () => {
  const {
    categoryTree,
    fetchCategoryTree,
    isFetchingCategories,
    addCategory,
    updateCategory,
  } = useContext(NoteContext);

  const [showForm, setShowForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null); // Holds category object for editing
  const [parentForNewSub, setParentForNewSub] = useState(null); // Holds parent category object when adding sub
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!categoryTree || categoryTree.length === 0) {
      fetchCategoryTree().catch((err) => {
        console.error("Failed to fetch category tree on mount:", err);
        setError("Could not load category hierarchy.");
      });
    }
  }, [categoryTree, fetchCategoryTree]);

  const handleAddNewTopLevel = () => {
    setCategoryToEdit(null);
    setParentForNewSub(null);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setParentForNewSub(null);
    setShowForm(true);
    setError(null);
    setSuccess(null);
    // Scroll form into view if needed
    const formElement = document.getElementById("category-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleAddSubcategory = (parentCategory) => {
    setCategoryToEdit(null);
    setParentForNewSub(parentCategory);
    setShowForm(true);
    setError(null);
    setSuccess(null);
    // Scroll form into view if needed
    const formElement = document.getElementById("category-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCategoryToEdit(null);
    setParentForNewSub(null);
    setError(null);
    // Keep success message visible briefly
  };

  const handleSaveCategory = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    let result;

    try {
      if (categoryToEdit) {
        // Updating existing category
        result = await updateCategory(categoryToEdit._id, formData);
      } else {
        // Adding new category (could be top-level or subcategory)
        result = await addCategory(formData);
      }

      if (result.success) {
        setSuccess(
          categoryToEdit
            ? "Category updated successfully!"
            : "Category added successfully!",
        );
        setShowForm(false);
        setCategoryToEdit(null);
        setParentForNewSub(null);
        // fetchCategoryTree(); // Re-fetch tree to show updates (already done in context)
      } else {
        setError(result.message || "Operation failed.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare initial data for the form when adding a subcategory
  const formInitialData = parentForNewSub
    ? { parent: parentForNewSub._id }
    : categoryToEdit || {}; // Pass existing data if editing

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-160px)]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-heading">Manage Categories</h1>
        <button onClick={handleAddNewTopLevel} className="btn-primary">
          + Add Top-Level Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded text-sm text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded text-sm text-center">
          {success}
        </div>
      )}

      {/* Category Form Section */}
      {showForm && (
        <div id="category-form-section" className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {categoryToEdit
              ? `Editing: ${categoryToEdit.name}`
              : parentForNewSub
              ? `Add Subcategory under: ${parentForNewSub.name}`
              : "Add New Top-Level Category"}
          </h2>
          <CategoryForm
            // Key forces re-render if edit target changes, ensuring form resets
            key={categoryToEdit?._id || parentForNewSub?._id || "new"}
            categoryToEdit={formInitialData} // Use prepared initial data
            onSave={handleSaveCategory}
          />
          <button
            onClick={handleCancelForm}
            className="btn-secondary mt-4"
            disabled={isLoading}
          >
            Cancel
          </button>
          {isLoading && (
            <div className="mt-2">
              <LoadingSpinner />
            </div>
          )}
        </div>
      )}

      {/* Category Tree Display */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Category Hierarchy</h2>
        {isFetchingCategories &&
        (!categoryTree || categoryTree.length === 0) ? (
          <LoadingSpinner />
        ) : !isFetchingCategories &&
          (!categoryTree || categoryTree.length === 0) ? (
          <p className="text-subtle">No categories created yet.</p>
        ) : (
          <ul className="list-none p-0">
            {categoryTree.map((rootNode) => (
              <AdminCategoryTreeNode
                key={rootNode._id}
                node={rootNode}
                onEdit={handleEditCategory}
                onAddSub={handleAddSubcategory}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
