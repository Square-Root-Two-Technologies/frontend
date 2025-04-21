// src/components/NoteForm/NoteForm.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import CategoryContext from "../../context/category/CategoryContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import MenuBar from "../EditorToolbar/MenuBar";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const generateCategoryOptions = (categories, parentId = null, level = 0) => {
  const options = [];
  const children = categories.filter(
    (cat) => cat.parent === parentId || (!cat.parent && parentId === null),
  );
  children.sort((a, b) => a.name.localeCompare(b.name));
  children.forEach((cat) => {
    options.push(
      <option
        key={cat._id}
        value={cat._id}
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        {cat.name}
      </option>,
    );
    const subOptions = generateCategoryOptions(categories, cat._id, level + 1);
    options.push(...subOptions);
  });
  return options;
};

const NoteForm = ({
  isEditMode = false,
  initialData = {},
  onSubmit,
  noteError,
}) => {
  const navigate = useNavigate();
  const { categories, getCategories, isFetchingCategories, categoryTreeError } =
    React.useContext(CategoryContext);
  const { currentUser, isUserLoading } = React.useContext(UserContext);

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    tag: initialData.tag || "",
    categoryId: initialData.categoryId || "",
    isFeatured: initialData.isFeatured || false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategoriesIfNeeded = useCallback(async () => {
    if (
      categories.length === 0 &&
      !isFetchingCategories &&
      !isUserLoading &&
      currentUser
    ) {
      try {
        await getCategories();
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          categories: "Failed to load categories",
        }));
      }
    }
  }, [
    categories.length,
    getCategories,
    isFetchingCategories,
    isUserLoading,
    currentUser,
  ]);

  useEffect(() => {
    fetchCategoriesIfNeeded();
  }, [fetchCategoriesIfNeeded]);

  useEffect(() => {
    if (categoryTreeError) {
      setErrors((prev) => ({ ...prev, categories: categoryTreeError }));
    }
  }, [categoryTreeError]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Placeholder.configure({ placeholder: "Write your note here..." }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: formData.description,
    editable: !isSubmitting && !isUserLoading && !!currentUser,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none p-4 min-h-[200px] sm:min-h-[300px] border border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 text-neutral dark:text-gray-200",
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, description: editor.getHTML() }));
      if (editor.getText().trim().length >= 5) {
        setErrors((prev) => ({ ...prev, description: "" }));
      }
    },
  });

  useEffect(() => {
    if (isEditMode && initialData.description && editor) {
      editor.commands.setContent(initialData.description, false);
    }
  }, [editor, initialData.description, isEditMode]);

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }
    if (!formData.description || editor?.getText().trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters long";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor || !currentUser) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        description: editor.getHTML(),
        isFeatured:
          currentUser.role === "admin" ? formData.isFeatured : undefined,
      });
      navigate("/my-notes");
    } catch (err) {
      setErrors({ submit: err.message || "Failed to save note" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const categoryOptions = useMemo(
    () => generateCategoryOptions(categories),
    [categories],
  );

  if (isUserLoading || (!currentUser && !isEditMode)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        path={[{ _id: "my-notes", name: "My Notes" }]}
        currentTitle={isEditMode ? "Edit Note" : "Add Note"}
      />
      <div className="card">
        <h1 className="text-heading mb-6 text-center">
          {isEditMode ? "Edit Note" : "Add New Note"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {(errors.submit || noteError) && (
            <div className="form-error">{errors.submit || noteError}</div>
          )}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral dark:text-gray-200"
            >
              Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Note Title"
              disabled={isSubmitting}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-error mt-1">
                {errors.title}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral dark:text-gray-200"
            >
              Description <span className="text-error">*</span>
            </label>
            <div className="mt-1 shadow-sm">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} id="description" />
            </div>
            {errors.description && (
              <p id="description-error" className="text-sm text-error mt-1">
                {errors.description}
              </p>
            )}
            <p className="text-subtle mt-1">
              Use the toolbar above to format your text.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-neutral dark:text-gray-200"
              >
                Category <span className="text-error">*</span>
              </label>
              <select
                name="categoryId"
                id="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="select-field mt-1"
                disabled={
                  isSubmitting ||
                  isFetchingCategories ||
                  categories.length === 0
                }
                aria-describedby={
                  errors.categoryId || errors.categories
                    ? "category-error"
                    : undefined
                }
              >
                <option value="" disabled>
                  {isFetchingCategories
                    ? "Loading categories..."
                    : errors.categories
                    ? "Error loading categories"
                    : categories.length === 0
                    ? "No categories available"
                    : "Select a category"}
                </option>
                {categoryOptions}
              </select>
              {(errors.categoryId || errors.categories) && (
                <p id="category-error" className="text-sm text-error mt-1">
                  {errors.categoryId || errors.categories}
                </p>
              )}
              {isFetchingCategories && !errors.categories && (
                <LoadingSpinner size="sm" />
              )}
            </div>
            <div>
              <label
                htmlFor="tag"
                className="block text-sm font-medium text-neutral dark:text-gray-200"
              >
                Tag <span className="text-subtle">(Optional)</span>
              </label>
              <input
                type="text"
                name="tag"
                id="tag"
                value={formData.tag}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="e.g., React, API"
                disabled={isSubmitting}
              />
            </div>
          </div>
          {currentUser?.role === "admin" && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                disabled={isSubmitting}
              />
              <label
                htmlFor="isFeatured"
                className="ml-2 text-sm font-medium text-neutral dark:text-gray-200"
              >
                Mark as Featured (Admin Only)
              </label>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className={`btn-primary flex-1 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting || !editor || isFetchingCategories}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Add Note"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-notes")}
              className={`btn-secondary flex-1 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
