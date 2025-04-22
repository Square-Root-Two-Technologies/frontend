import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import NoteContext from "../../context/Notes/NoteContext";
import CategoryContext from "../../context/category/CategoryContext";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapLink from "@tiptap/extension-link";
import MenuBar from "../EditorToolbar/MenuBar";

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

const EditNote = () => {
  const { editNote, getNoteById, isFetchingNote, singleNoteError } =
    useContext(NoteContext);
  const { categories, getCategories, isFetchingCategories, categoryTreeError } =
    useContext(CategoryContext);
  const { currentUser, isUserLoading } = useContext(UserContext);

  const navigate = useNavigate();
  const { id } = useParams();

  const [noteFormData, setNoteFormData] = useState({
    _id: id,
    title: "",
    description: "",
    tag: "",
    categoryId: "",
    isFeatured: false,
    user: null,
  });
  const [error, setError] = useState("");
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const categoryOptions = useMemo(
    () => generateCategoryOptions(categories),
    [categories],
  );

  const isAdminOrSuperAdmin = useMemo(() => {
    const allowedRoles = ["admin", "SuperAdmin"];
    return allowedRoles.includes(currentUser?.role);
  }, [currentUser?.role]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Placeholder.configure({ placeholder: "Write your note here..." }),
      TiptapLink.configure({ openOnClick: false, autolink: true }),
    ],
    content: "",
    editable: false,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none p-4 min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800 text-neutral dark:text-gray-200",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setNoteFormData((prevNote) => ({
        ...prevNote,
        description: currentEditor.getHTML(),
      }));
      if (currentEditor?.getText().trim().length >= 5) {
        setError((prev) =>
          prev === "Description must be at least 5 characters long."
            ? ""
            : prev,
        );
      }
    },
  });

  const fetchCategoriesIfNeeded = useCallback(async () => {
    if (
      categories.length === 0 &&
      !isFetchingCategories &&
      !isUserLoading &&
      currentUser
    ) {
      console.log("EditNote: Fetching categories...");
      try {
        await getCategories();
      } catch (err) {
        console.error("Failed to fetch categories for EditNote:", err);
        setError("Could not load categories. Please try refreshing.");
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
      setError((prev) =>
        prev
          ? `${prev}\nFailed to load categories: ${categoryTreeError}`
          : `Failed to load categories: ${categoryTreeError}`,
      );
    }
  }, [categoryTreeError]);

  useEffect(() => {
    let isMounted = true;
    if (isUserLoading) {
      setIsComponentLoading(true);
      return;
    }
    if (!currentUser) {
      setError("Authentication required to edit notes.");
      setIsComponentLoading(false);
      if (isMounted) navigate("/login");
      return;
    }
    console.log(`EditNote Effect: User loaded, fetching note ID: ${id}`);
    setIsComponentLoading(true);
    setError("");
    getNoteById(id)
      .then((fetchedNote) => {
        if (!isMounted) return;
        if (!fetchedNote) {
          setError(singleNoteError || "Note could not be loaded or not found.");
          setIsComponentLoading(false);
          setIsAuthorized(false);
          editor?.setEditable(false);
          return;
        }
        const allowedAdminRoles = ["admin", "SuperAdmin"];
        const authorized =
          fetchedNote.user?._id === currentUser._id ||
          allowedAdminRoles.includes(currentUser.role);
        setIsAuthorized(authorized);
        if (authorized) {
          setNoteFormData({
            _id: fetchedNote._id,
            title: fetchedNote.title || "",
            description: fetchedNote.description || "",
            tag: fetchedNote.tag || "",
            categoryId: fetchedNote.category?._id || "",
            isFeatured: fetchedNote.isFeatured || false,
            user: fetchedNote.user,
          });
          if (editor && fetchedNote.description) {
            setTimeout(
              () => editor?.commands.setContent(fetchedNote.description, false),
              0,
            );
          }
          editor?.setEditable(true);
        } else {
          setError("You do not have permission to edit this note.");
          editor?.setEditable(false);
        }
        setIsComponentLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error explicitly caught in EditNote data fetch:", err);
          setError(singleNoteError || "An error occurred loading the note.");
          setIsComponentLoading(false);
          setIsAuthorized(false);
          editor?.setEditable(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [
    id,
    currentUser,
    isUserLoading,
    getNoteById,
    navigate,
    editor,
    singleNoteError,
  ]);

  useEffect(() => {
    editor?.setEditable(!isSubmitting && !isComponentLoading && isAuthorized);
  }, [editor, isSubmitting, isComponentLoading, isAuthorized]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor || !isAuthorized) return;
    let currentError = "";
    if (!noteFormData.title || noteFormData.title.length < 3) {
      currentError = "Title must be at least 3 characters long.";
    }
    const descriptionContent = editor.getHTML();
    if (
      (!descriptionContent || editor.getText().trim().length < 5) &&
      !currentError
    ) {
      currentError = "Description must be at least 5 characters long.";
    }
    if (!noteFormData.categoryId && !currentError) {
      currentError = "Please select a category.";
    }
    setError(currentError);
    if (currentError) return;
    setIsSubmitting(true);
    try {
      const allowedAdminRoles = ["admin", "SuperAdmin"];
      const finalIsFeatured = allowedAdminRoles.includes(currentUser?.role)
        ? noteFormData.isFeatured
        : undefined;
      await editNote(
        id,
        noteFormData.title,
        descriptionContent,
        noteFormData.tag,
        noteFormData.categoryId,
        finalIsFeatured,
      );
      console.log("Note update submitted successfully for ID:", id);
      navigate("/my-notes");
    } catch (err) {
      console.error("Failed to update note:", err);
      setError(
        err.message ||
          "Failed to update note. Please check fields or try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setNoteFormData((prevNote) => ({
      ...prevNote,
      [name]: inputType === "checkbox" ? checked : value,
    }));
    if (name === "title" && value.length >= 3) {
      setError((prev) =>
        prev === "Title must be at least 3 characters long." ? "" : prev,
      );
    }
    if (name === "categoryId" && value) {
      setError((prev) => (prev === "Please select a category." ? "" : prev));
    }
  };

  const showLoading =
    isComponentLoading ||
    isUserLoading ||
    isFetchingNote ||
    (!editor && !singleNoteError && !error);

  if (showLoading && !error && !singleNoteError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const displayError = error || singleNoteError;
  const errorTextColor = "text-red-600 dark:text-red-400";
  const primaryButtonClasses =
    "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out";

  if (!isComponentLoading && displayError && !isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className={`text-lg ${errorTextColor} mb-4`}>{displayError}</p>
        <Link to="/my-notes" className={primaryButtonClasses}>
          Back to Notes
        </Link>
      </div>
    );
  }

  const baseTextColor = "text-gray-800 dark:text-gray-200";
  const inputClasses =
    "appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm rounded-md";
  const secondaryButtonClasses =
    "inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out";
  const disabledButtonClasses =
    "bg-blue-400 dark:bg-blue-800 cursor-not-allowed opacity-50";
  const checkboxClasses =
    "h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 rounded";
  const requiredMarkClasses = "text-red-600 dark:text-red-400";
  const labelClasses = `block text-sm font-medium ${baseTextColor}`;
  const errorTextClasses =
    "text-sm text-red-600 dark:text-red-400 text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-md";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h1
          className={`text-2xl md:text-3xl font-bold ${baseTextColor} mb-6 text-center`}
        >
          Edit Note
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className={errorTextClasses}>{error}</div>}
          {singleNoteError && !error && (
            <div className={errorTextClasses}>{singleNoteError}</div>
          )}
          <div>
            <label htmlFor="title" className={labelClasses}>
              Title <span className={requiredMarkClasses}>*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              minLength="3"
              value={noteFormData.title}
              onChange={onChange}
              className={`${inputClasses} mt-1`}
              placeholder="Note Title"
              disabled={isSubmitting || !isAuthorized}
            />
          </div>
          <div>
            <label htmlFor="description" className={labelClasses}>
              Description <span className={requiredMarkClasses}>*</span>
            </label>
            <div className="mt-1 shadow-sm">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} id="description" />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use the toolbar above to format your text.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="categoryId" className={labelClasses}>
                Category <span className={requiredMarkClasses}>*</span>
              </label>
              <select
                name="categoryId"
                id="categoryId"
                required
                value={noteFormData.categoryId}
                onChange={onChange}
                className={`${inputClasses} mt-1`}
                disabled={
                  isSubmitting ||
                  isFetchingCategories ||
                  categories.length === 0 ||
                  !!categoryTreeError ||
                  !isAuthorized
                }
              >
                <option value="" disabled>
                  {isFetchingCategories
                    ? "Loading..."
                    : categoryTreeError
                    ? "Error loading categories"
                    : categories.length === 0
                    ? "No categories available"
                    : "Select a category"}
                </option>
                {categoryOptions}
              </select>
              {isFetchingCategories && !categoryTreeError && (
                <LoadingSpinner size="sm" />
              )}
            </div>
            <div>
              <label htmlFor="tag" className={labelClasses}>
                Tag <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                name="tag"
                id="tag"
                value={noteFormData.tag}
                onChange={onChange}
                className={`${inputClasses} mt-1`}
                placeholder="e.g., React, ProjectX"
                disabled={isSubmitting || !isAuthorized}
              />
            </div>
          </div>
          {isAdminOrSuperAdmin && (
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={noteFormData.isFeatured}
                onChange={onChange}
                className={checkboxClasses}
                disabled={isSubmitting || !isAuthorized}
              />
              <label
                htmlFor="isFeatured"
                className={`ml-2 block text-sm font-medium ${labelClasses}`}
              >
                Mark as Featured (Admin/SuperAdmin Only)
              </label>
            </div>
          )}
          <div className="pt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className={`${primaryButtonClasses} flex-1 ${
                isSubmitting ? disabledButtonClasses : ""
              }`}
              disabled={
                isSubmitting ||
                !editor ||
                !isAuthorized ||
                isFetchingCategories ||
                !!categoryTreeError
              }
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-notes")}
              className={`${secondaryButtonClasses} flex-1 ${
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

export default EditNote;
