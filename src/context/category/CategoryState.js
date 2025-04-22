import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import CategoryContext from "./CategoryContext";

const CategoryState = (props) => {
  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";
  const [categories, setCategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [categoryTreeError, setCategoryTreeError] = useState(null);
  const [currentCategoryDetails, setCurrentCategoryDetails] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState([]);
  const [hasMoreCategoryNotes, setHasMoreCategoryNotes] = useState(true);
  const [categoryLastId, setCategoryLastId] = useState(null);
  const [isFetchingCategoryNotes, setIsFetchingCategoryNotes] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [fetchedCategoryNotesMap, setFetchedCategoryNotesMap] = useState({});
  const [categoryNotesLoadingMap, setCategoryNotesLoadingMap] = useState({});
  const [categoryNotesErrorMap, setCategoryNotesErrorMap] = useState({});

  const fetchCategoryTree = useCallback(async () => {
    // Prevent duplicate fetches
    if (isFetchingCategories) {
      console.log(
        "CategoryState: fetchCategoryTree skipped (already fetching).",
      );
      return;
    }
    console.log("CategoryState: Fetching category tree structure...");
    setIsFetchingCategories(true);
    setCategoryTreeError(null);
    // Resetting tree/categories before fetch might help if there's stale data issue
    // setCategoryTree([]);
    // setCategories([]);

    try {
      const response = await fetch(`${host}/api/categories/tree/structured`);
      const responseText = await response.text(); // Read response as text first
      console.log(
        "CategoryState: API Response Text:",
        responseText.substring(0, 500),
      ); // Log raw response

      if (!response.ok) {
        let errorMsg = `HTTP error fetching tree! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(responseText);
          errorMsg = errorJson.error || errorMsg;
        } catch (e) {
          // Keep the original error message if parsing fails
        }
        throw new Error(errorMsg);
      }

      const json = JSON.parse(responseText); // Parse JSON only if response is ok
      console.log("CategoryState: Parsed API Response JSON:", json);

      if (json.success && Array.isArray(json.categoryTree)) {
        console.log(
          `CategoryState: API success. Received ${json.categoryTree.length} root nodes.`,
        );
        setCategoryTree(json.categoryTree); // <-- Set the tree state

        // Helper function to flatten the tree structure for the 'categories' list
        const flattenTree = (nodes) => {
          let list = [];
          nodes.forEach((node) => {
            list.push({
              _id: node._id,
              name: node.name,
              description: node.description,
              parent: node.parent, // Keep parent ID if needed
            });
            if (node.children && node.children.length > 0) {
              list = list.concat(flattenTree(node.children));
            }
          });
          return list;
        };
        const flatList = flattenTree(json.categoryTree);
        setCategories(flatList); // <-- Set the flat list state
        console.log(
          `CategoryState: Category tree and flat list (${flatList.length} total items) updated successfully.`,
        );
      } else {
        // Handle cases where success might be true but data is missing/wrong
        const errMsg =
          json.error ||
          "API reported success=false or categoryTree is not an array.";
        console.error(
          "CategoryState: Failed to process category tree data:",
          errMsg,
        );
        setCategoryTree([]); // Ensure state is empty on failure
        setCategories([]);
        setCategoryTreeError(errMsg);
      }
    } catch (err) {
      console.error(
        "CategoryState: Network or processing error fetching category tree:",
        err,
      );
      setCategoryTree([]); // Ensure state is empty on error
      setCategories([]);
      setCategoryTreeError(
        err.message || "Network error loading category tree.",
      );
    } finally {
      setIsFetchingCategories(false);
      console.log(
        "CategoryState: Fetch category tree finished. isFetchingCategories set to false.",
      );
    }
  }, [host, isFetchingCategories]); // isFetchingCategories dependency prevents re-entry

  // --- Rest of the CategoryState functions (getCategories, addCategory, etc.) remain the same ---
  // getCategories function (no changes needed, relies on fetchCategoryTree)
  const getCategories = useCallback(async () => {
    console.log(
      "CategoryState: getCategories called. Checking if fetch needed...",
    );
    if (categories.length === 0 && !isFetchingCategories) {
      console.log(
        "CategoryState: Categories empty and not fetching, calling fetchCategoryTree().",
      );
      await fetchCategoryTree();
    } else {
      console.log(
        `CategoryState: Categories already loaded (${categories.length} items) or currently fetching.`,
      );
    }
    return categories;
  }, [categories, isFetchingCategories, fetchCategoryTree]);

  // addCategory (no changes needed)
  const addCategory = useCallback(
    async (categoryData) => {
      const token = localStorage.getItem("token");
      if (!token)
        return { success: false, message: "Authentication required." };
      console.log("Admin: Adding category", categoryData);
      try {
        const response = await fetch(`${host}/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify(categoryData),
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || `HTTP Error: ${response.status}`);
        await fetchCategoryTree();
        return { success: true, category: result.category };
      } catch (error) {
        console.error("Error adding category:", error);
        return { success: false, message: error.message };
      }
    },
    [host, fetchCategoryTree],
  );

  // updateCategory (no changes needed)
  const updateCategory = useCallback(
    async (categoryId, categoryData) => {
      const token = localStorage.getItem("token");
      if (!token)
        return { success: false, message: "Authentication required." };
      console.log(`Admin: Updating category ${categoryId}`, categoryData);
      try {
        const response = await fetch(`${host}/api/categories/${categoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify(categoryData),
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || `HTTP Error: ${response.status}`);
        await fetchCategoryTree();
        return { success: true, category: result.category };
      } catch (error) {
        console.error("Error updating category:", error);
        return { success: false, message: error.message };
      }
    },
    [host, fetchCategoryTree],
  );

  // getCategoryDetailsById (no changes needed)
  const getCategoryDetailsById = useCallback(
    async (categoryId) => {
      console.log(
        `CategoryState: Fetching category details for ID: ${categoryId}`,
      );
      setCategoryError(null);
      if (!categoryId) {
        console.error(
          "CategoryState: getCategoryDetailsById: Invalid category ID provided:",
          categoryId,
        );
        setCategoryError("Invalid category specified.");
        setCurrentCategoryDetails(null);
        return;
      }
      if (currentCategoryDetails && currentCategoryDetails._id === categoryId) {
        console.log(
          "CategoryState: Category details already loaded:",
          categoryId,
        );
        return;
      }

      // Try finding in the flat list first
      const existingCategory = categories.find((cat) => cat._id === categoryId);
      if (existingCategory) {
        console.log(
          "CategoryState: Found category details in pre-fetched list:",
          categoryId,
        );
        setCurrentCategoryDetails(existingCategory);
        return;
      }

      // If not found, fetch from API (less common if tree is fetched)
      console.log(
        "CategoryState: Category details not in flat list, fetching from API:",
        categoryId,
      );
      setIsFetchingCategoryNotes(true); // Use category notes fetching flag for details too? Maybe add a specific one? Reusing for now.
      try {
        const response = await fetch(`${host}/api/categories/${categoryId}`);
        const responseText = await response.text(); // Get text first
        if (!response.ok) {
          let errorMsg = `HTTP error fetching category details! Status: ${response.status}`;
          if (response.status === 404) errorMsg = "Category not found.";
          else {
            try {
              const errJson = JSON.parse(responseText);
              errorMsg = errJson.error || errorMsg;
            } catch (parseErr) {}
          }
          throw new Error(errorMsg);
        }
        const json = JSON.parse(responseText);
        if (json.success && json.category) {
          setCurrentCategoryDetails(json.category);
          console.log(
            "CategoryState: Category details fetched from API:",
            json.category.name,
          );
        } else {
          throw new Error(
            json.error || "Failed to get valid category details from API.",
          );
        }
      } catch (err) {
        console.error("CategoryState: Error fetching category details:", err);
        setCategoryError(err.message);
        setCurrentCategoryDetails(null);
      } finally {
        setIsFetchingCategoryNotes(false);
      }
    },
    [host, categories, currentCategoryDetails],
  );

  // fetchCategoryNotesBatch (no changes needed)
  const fetchCategoryNotesBatch = useCallback(
    async (categoryId, reset = false) => {
      if (!reset && (isFetchingCategoryNotes || !hasMoreCategoryNotes)) {
        console.log(
          `CategoryState: Category fetch skipped for ${categoryId} (fetching/no more)`,
        );
        return;
      }
      if (!categoryId) {
        console.error(
          "CategoryState: fetchCategoryNotesBatch: Invalid category ID:",
          categoryId,
        );
        setCategoryError("Invalid category specified.");
        return;
      }

      const needsReset = reset || categoryId !== currentCategoryId;
      console.log(
        `CategoryState: Fetching category notes: ID=${categoryId}, Reset=${needsReset}, CurrentStoredID=${currentCategoryId}, LastNoteID=${categoryLastId}`,
      );

      setIsFetchingCategoryNotes(true);
      setCategoryError(null);

      if (needsReset) {
        setCategoryNotes([]);
        setCategoryLastId(null);
        setHasMoreCategoryNotes(true);
        setCurrentCategoryId(categoryId);
      }

      const currentLastIdForFetch = needsReset ? null : categoryLastId;
      const limit = 9;
      const url = `${host}/api/notes/by-category/${categoryId}?limit=${limit}${
        currentLastIdForFetch ? `&lastId=${currentLastIdForFetch}` : ""
      }`;
      console.log("CategoryState: Fetching Category Notes URL:", url);

      try {
        const response = await fetch(url);
        const responseText = await response.text(); // Read text first
        console.log(
          "CategoryState: fetchCategoryNotesBatch Response Text:",
          responseText.substring(0, 500),
        );

        if (!response.ok) {
          if (response.status === 404) {
            console.log(
              `CategoryState: Category ${categoryId} not found or no notes found.`,
            );
            setHasMoreCategoryNotes(false);
            if (needsReset) setCategoryNotes([]);
          } else {
            let errorMsg = `HTTP error! Status: ${response.status}`;
            try {
              const errJson = JSON.parse(responseText);
              errorMsg = errJson.error || errorMsg;
            } catch (e) {}
            throw new Error(errorMsg);
          }
        } else {
          const json = JSON.parse(responseText); // Parse if OK
          if (json.success && Array.isArray(json.notes)) {
            setCategoryNotes((prevNotes) => {
              const newNotes = json.notes;
              const combined = needsReset
                ? newNotes
                : [...prevNotes, ...newNotes];
              // Ensure uniqueness
              const uniqueNotes = Array.from(
                new Map(combined.map((item) => [item._id, item])).values(),
              );
              return uniqueNotes;
            });
            setCategoryLastId(json.nextLastId);
            setHasMoreCategoryNotes(json.hasMore);
            console.log(
              `CategoryState: Category notes fetch success. Fetched: ${json.notes.length}, Has More: ${json.hasMore}, Next Last ID: ${json.nextLastId}`,
            );
          } else {
            console.error(
              "CategoryState: Category notes fetch API reported success=false or missing notes array:",
              json.error,
            );
            setHasMoreCategoryNotes(false);
            if (needsReset) setCategoryNotes([]);
          }
        }
      } catch (err) {
        console.error(
          `CategoryState: Error fetching notes for category ${categoryId}:`,
          err,
        );
        setCategoryError(err.message || "Failed to fetch category notes.");
        setHasMoreCategoryNotes(false);
        if (needsReset) setCategoryNotes([]);
      } finally {
        setIsFetchingCategoryNotes(false);
      }
    },
    [
      host,
      isFetchingCategoryNotes,
      hasMoreCategoryNotes,
      categoryLastId,
      currentCategoryId,
    ],
  );

  // fetchPostsForCategory (no changes needed)
  const fetchPostsForCategory = useCallback(
    async (categoryId) => {
      if (!categoryId || categoryNotesLoadingMap[categoryId]) {
        console.log(
          `CategoryState: FetchPostsForCategory skipped for ${categoryId} (no ID or already loading)`,
        );
        return;
      }
      console.log(
        `CategoryState: Fetching posts on demand for category ID: ${categoryId}`,
      );

      setCategoryNotesLoadingMap((prev) => ({ ...prev, [categoryId]: true }));
      setCategoryNotesErrorMap((prev) => ({ ...prev, [categoryId]: null }));

      try {
        const url = `${host}/api/notes/by-category/${categoryId}/titles`;
        const response = await fetch(url);
        const responseText = await response.text(); // Read text first
        if (!response.ok) {
          let errorMsg = `HTTP error! Status: ${response.status}`;
          try {
            const errorJson = JSON.parse(responseText);
            errorMsg = errorJson.error || errorMsg;
          } catch (e) {}
          throw new Error(errorMsg);
        }

        const json = JSON.parse(responseText); // Parse if OK
        if (json.success && Array.isArray(json.notes)) {
          setFetchedCategoryNotesMap((prev) => ({
            ...prev,
            [categoryId]: json.notes,
          }));
          console.log(
            `CategoryState: Fetched ${json.notes.length} posts for category ${categoryId}`,
          );
        } else {
          console.error(
            "CategoryState: Failed to fetch posts for category:",
            json.error || "Invalid data format",
          );
          setFetchedCategoryNotesMap((prev) => ({ ...prev, [categoryId]: [] }));
          setCategoryNotesErrorMap((prev) => ({
            ...prev,
            [categoryId]: json.error || "Failed to load posts",
          }));
        }
      } catch (error) {
        console.error(
          `CategoryState: Error fetching posts for category ${categoryId}:`,
          error,
        );
        setFetchedCategoryNotesMap((prev) => ({ ...prev, [categoryId]: [] }));
        setCategoryNotesErrorMap((prev) => ({
          ...prev,
          [categoryId]: error.message || "Could not load posts.",
        }));
      } finally {
        setCategoryNotesLoadingMap((prev) => ({
          ...prev,
          [categoryId]: false,
        }));
      }
    },
    [host, categoryNotesLoadingMap], // categoryNotesLoadingMap dependency prevents re-entry
  );

  // Initial fetch effect
  useEffect(() => {
    console.log("CategoryState: Initial mount, fetching category tree.");
    fetchCategoryTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const contextValue = useMemo(
    () => ({
      categories,
      categoryTree,
      isFetchingCategories,
      categoryTreeError,
      currentCategoryDetails,
      categoryNotes,
      hasMoreCategoryNotes,
      isFetchingCategoryNotes,
      categoryError,
      fetchedCategoryNotesMap,
      categoryNotesLoadingMap,
      categoryNotesErrorMap,
      // --- Methods ---
      fetchCategoryTree, // Make sure fetch is included if needed externally
      getCategories,
      addCategory,
      updateCategory,
      getCategoryDetailsById,
      fetchCategoryNotesBatch,
      fetchPostsForCategory,
    }),
    [
      categories,
      categoryTree,
      isFetchingCategories,
      categoryTreeError,
      currentCategoryDetails,
      categoryNotes,
      hasMoreCategoryNotes,
      isFetchingCategoryNotes,
      categoryError,
      fetchedCategoryNotesMap,
      categoryNotesLoadingMap,
      categoryNotesErrorMap,
      // --- Method dependencies ---
      fetchCategoryTree,
      getCategories,
      addCategory,
      updateCategory,
      getCategoryDetailsById,
      fetchCategoryNotesBatch,
      fetchPostsForCategory,
    ],
  );

  return (
    <CategoryContext.Provider value={contextValue}>
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;
