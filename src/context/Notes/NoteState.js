import NoteContext from "./NoteContext";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

const NoteState = (props) => {
  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [note, setNote] = useState(null);
  const [isFetchingNote, setIsFetchingNote] = useState(false);
  const [error, setError] = useState(null);
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
  const [featuredNotes, setFeaturedNotes] = useState([]);
  const [featuredLastId, setFeaturedLastId] = useState(null);
  const [hasMoreFeatured, setHasMoreFeatured] = useState(true);
  const [isInitialFeaturedLoading, setIsInitialFeaturedLoading] =
    useState(false);
  const [isFetchingMoreFeatured, setIsFetchingMoreFeatured] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [categoryNotesList, setCategoryNotesList] = useState([]);
  const [isFetchingCategoryNotesList, setIsFetchingCategoryNotesList] =
    useState(false);
  const [categoryNotesListError, setCategoryNotesListError] = useState(null);
  const initialFetchInitiated = useRef(false);

  // --- Moved fetchAllNotesByCategory definition UP ---
  const fetchAllNotesByCategory = useCallback(
    async (categoryId) => {
      if (!categoryId) {
        console.warn("fetchAllNotesByCategory called with no categoryId");
        setCategoryNotesList([]);
        setCategoryNotesListError("No category specified.");
        return;
      }
      console.log(
        `Workspaceing ALL note titles for sidebar, category ID: ${categoryId}`,
      );
      setIsFetchingCategoryNotesList(true);
      setCategoryNotesList([]); // Reset before fetching new list
      setCategoryNotesListError(null);
      try {
        const url = `${host}/api/notes/by-category/${categoryId}/titles`;
        const response = await fetch(url);
        const json = await response.json();

        if (!response.ok)
          throw new Error(
            json.error || `HTTP error! Status: ${response.status}`,
          );

        if (json.success && Array.isArray(json.notes)) {
          setCategoryNotesList(json.notes);
          console.log(
            `Workspaceed ${json.notes.length} notes for category sidebar (ID: ${categoryId})`,
          );
        } else {
          console.error(
            "Failed to fetch all notes by category:",
            json.error || "Invalid data format",
          );
          setCategoryNotesList([]); // Ensure empty if failed
        }
      } catch (error) {
        console.error("Error fetching all notes by category:", error);
        setCategoryNotesListError(
          error.message || "Could not load related posts.",
        );
        setCategoryNotesList([]); // Ensure empty on error
      } finally {
        setIsFetchingCategoryNotesList(false);
      }
    },
    [host], // Only depends on host
  );

  const getCategoryDetailsById = useCallback(
    async (categoryId) => {
      console.log(`Workspaceing category details for ID: ${categoryId}`);
      setCategoryError(null); // Reset error
      if (!categoryId) {
        console.error(
          "getCategoryDetailsById: Invalid category ID provided:",
          categoryId,
        );
        setCategoryError("Invalid category specified.");
        setCurrentCategoryDetails(null);
        return;
      }

      try {
        const response = await fetch(`${host}/api/categories/${categoryId}`);
        if (!response.ok) {
          let errorMsg = `HTTP error fetching category details! Status: ${response.status}`;
          if (response.status === 404) errorMsg = "Category not found.";
          else {
            try {
              const errJson = await response.json();
              errorMsg = errJson.error || errorMsg;
            } catch (parseErr) {
              /* Ignore parsing error if response wasn't JSON */
            }
          }
          throw new Error(errorMsg);
        }
        const json = await response.json();
        if (json.success && json.category) {
          setCurrentCategoryDetails(json.category);
          console.log("Category details fetched:", json.category.name);
        } else {
          throw new Error(
            json.error || "Failed to get valid category details.",
          );
        }
      } catch (err) {
        console.error("Error fetching category details:", err);
        setCategoryError(err.message); // Set specific error message
        setCurrentCategoryDetails(null);
      }
    },
    [host], // Dependency
  );

  const fetchNoteBySlug = useCallback(
    async (slug) => {
      if (!slug) {
        console.warn("fetchNoteBySlug called with empty slug.");
        setError("Invalid post URL.");
        setNote(null);
        setIsFetchingNote(false);
        return;
      }
      console.log(`Attempting to fetch note by SLUG: ${slug}`);
      setIsFetchingNote(true);
      setError(null);
      setNote(null); // Reset note before fetching
      try {
        const response = await fetch(
          `${host}/api/notes/fetchNoteBySlug/${slug}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const data = await response.json(); // Always try to parse JSON

        if (!response.ok) {
          const errorMessage =
            data.error || `Could not find post (Status: ${response.status})`;
          setError(errorMessage);
          setNote(null); // Ensure note is null on error
          console.error(
            `Workspace note by slug failed (slug: ${slug}):`,
            errorMessage,
          );
        } else {
          setNote(data);
          setError(null); // Clear error on success
          console.log(
            `Single note fetched successfully by slug (Title: ${
              data.title
            }, Path Length: ${data.ancestorPath?.length ?? 0})`,
          );
        }
      } catch (err) {
        console.error(
          "Network or parsing error fetching single note by slug:",
          err,
        );
        setError(err.message || "Failed to fetch note due to a network issue.");
        setNote(null);
      } finally {
        setIsFetchingNote(false); // Ensure loading state is turned off
      }
    },
    [host], // Dependency
  );

  const fetchFeaturedNotesBatch = useCallback(
    async (isInitialLoad = false, retryCount = 0) => {
      const maxRetries = 3;
      const isLoading = isInitialLoad
        ? isInitialFeaturedLoading
        : isFetchingMoreFeatured;
      const setLoading = isInitialLoad
        ? setIsInitialFeaturedLoading
        : setIsFetchingMoreFeatured;

      // Prevent concurrent fetches or fetching when no more data exists
      if (isLoading || (!isInitialLoad && !hasMoreFeatured)) return;

      console.log(
        `Workspaceing featured batch. Initial: ${isInitialLoad}, Last ID: ${featuredLastId}`,
      );
      setLoading(true);
      const limit = 5; // How many featured notes to fetch per batch
      const currentLastId = isInitialLoad ? null : featuredLastId;
      const url = `${host}/api/notes/featured/batch?limit=${limit}${
        currentLastId ? `&lastId=${currentLastId}` : ""
      }`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const json = await response.json();

        if (!response.ok)
          throw new Error(
            json.error || `HTTP error! Status: ${response.status}`,
          );

        if (json.success && json.notes) {
          setFeaturedNotes((prevNotes) => {
            // Ensure no duplicates are added
            const existingIds = new Set(prevNotes.map((n) => n._id));
            const newUniqueNotes = json.notes.filter(
              (n) => !existingIds.has(n._id),
            );
            const updatedNotes = isInitialLoad
              ? newUniqueNotes
              : [...prevNotes, ...newUniqueNotes];
            console.log(
              `Featured Batch: Initial=${isInitialLoad}. Added ${newUniqueNotes.length}. Total: ${updatedNotes.length}`,
            );
            return updatedNotes;
          });
          setFeaturedLastId(json.nextLastId); // Update the last ID for the next fetch
          setHasMoreFeatured(json.hasMore); // Update whether there's more data
        } else {
          // If API reports success=false or notes array is missing
          setHasMoreFeatured(false);
        }
      } catch (error) {
        console.error("Error fetching featured notes:", error);
        // Implement retry logic
        if (retryCount < maxRetries) {
          console.log(`Retrying fetch featured... Attempt ${retryCount + 1}`);
          setTimeout(() => {
            fetchFeaturedNotesBatch(isInitialLoad, retryCount + 1);
          }, 1000 * (retryCount + 1)); // Exponential backoff (simple version)
        } else {
          setError("Failed to fetch featured notes after retries.");
          setHasMoreFeatured(false); // Stop trying after max retries
        }
      } finally {
        setLoading(false);
      }
    },
    [
      host,
      featuredLastId,
      hasMoreFeatured,
      isInitialFeaturedLoading,
      isFetchingMoreFeatured,
      setError, // Include setError if you use it inside (for retries failure)
    ], // Dependencies
  );

  const getRecentPosts = useCallback(
    async (limit = 5) => {
      console.log("Fetching recent posts...");
      try {
        const response = await fetch(
          `${host}/api/notes/recent?limit=${limit}`,
          { method: "GET", headers: { "Content-Type": "application/json" } },
        );
        const json = await response.json();
        if (json.success) {
          setRecentPosts(json.notes);
          console.log("Recent posts fetched:", json.notes.length);
        } else console.error("Failed to fetch recent posts:", json.error);
      } catch (error) {
        console.error("Network error fetching recent posts:", error);
      }
    },
    [host], // Dependency
  );

  const fetchNextBatchOfNotes = useCallback(async () => {
    if (isFetching || !hasMore) return; // Prevent concurrent fetches or fetching when no more data exists
    console.log("Fetch initiated for allNotes. Current lastId:", lastId);
    setIsFetching(true);
    setError(null); // Clear previous errors
    const limit = 9; // Number of notes per batch
    const url = `${host}/api/notes/fetchNextNote?limit=${limit}${
      lastId ? `&lastId=${lastId}` : ""
    }`;
    console.log("Fetching next batch URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await response.json();

      if (!response.ok)
        throw new Error(json.error || `HTTP error! Status: ${response.status}`);

      if (json.success && json.notes) {
        setAllNotes((prevNotes) => {
          // Filter out duplicates before adding
          const existingIds = new Set(prevNotes.map((n) => n._id));
          const newUniqueNotes = json.notes.filter(
            (n) => !existingIds.has(n._id),
          );
          const updatedNotes = [...prevNotes, ...newUniqueNotes];
          console.log(
            `Added ${newUniqueNotes.length} new notes. Total: ${updatedNotes.length}`,
          );
          return updatedNotes;
        });
        const newLastId = json.nextLastId;
        setLastId(newLastId); // Update the last ID for the next fetch
        setHasMore(json.hasMore); // Update whether more notes are available
        console.log(
          "Fetch successful. New lastId:",
          newLastId,
          "Has More:",
          json.hasMore,
        );
        if (!initialLoadDone) {
          console.log("Setting initialLoadDone = true");
          setInitialLoadDone(true); // Mark initial load as complete
        }
      } else {
        // Handle cases where API reports success=false or notes array is missing
        console.error(
          "API Error or invalid data:",
          json.error || "No notes array received",
        );
        setHasMore(false); // Assume no more notes if data is invalid
      }
    } catch (error) {
      console.error("Error fetching next batch of notes:", error);
      setError(error.message);
      setHasMore(false); // Stop fetching on error
    } finally {
      setIsFetching(false); // Always set fetching to false
    }
  }, [host, lastId, hasMore, isFetching, initialLoadDone]); // Dependencies

  const fetchCategoryNotesBatch = useCallback(
    async (categoryId, reset = false) => {
      // Prevent fetching if already fetching or no more notes for the current category (unless resetting)
      if (!reset && (isFetchingCategoryNotes || !hasMoreCategoryNotes)) {
        console.log(
          `Category fetch skipped for ${categoryId} (fetching/no more)`,
        );
        return;
      }

      if (!categoryId) {
        console.error(
          "fetchCategoryNotesBatch: Invalid category ID:",
          categoryId,
        );
        setCategoryError("Invalid category specified.");
        return;
      }

      const needsReset = reset || categoryId !== currentCategoryId; // Determine if state needs resetting

      console.log(
        `Workspaceing category notes: ID=${categoryId}, Reset=${needsReset}, CurrentStoredID=${currentCategoryId}, LastNoteID=${categoryLastId}`,
      );

      setIsFetchingCategoryNotes(true);
      setCategoryError(null); // Clear previous errors

      if (needsReset) {
        setCategoryNotes([]);
        setCategoryLastId(null);
        setHasMoreCategoryNotes(true); // Assume more are available initially
        setCurrentCategoryId(categoryId); // Update the current category ID
      }

      const currentLastIdForFetch = needsReset ? null : categoryLastId;
      const limit = 9; // Notes per page for category view
      const url = `${host}/api/notes/by-category/${categoryId}?limit=${limit}${
        currentLastIdForFetch ? `&lastId=${currentLastIdForFetch}` : ""
      }`;
      console.log("Fetching Category Notes URL:", url);

      try {
        const response = await fetch(url);
        const json = await response.json();

        if (!response.ok) {
          // Handle 404 (category not found or no notes) gracefully
          if (response.status === 404) {
            console.log(`Category ${categoryId} not found or no notes found.`);
            setHasMoreCategoryNotes(false);
            if (needsReset) setCategoryNotes([]); // Ensure notes are empty if reset and 404
          }
          // Handle other errors
          else {
            const errorMsg =
              json.error || `HTTP error! Status: ${response.status}`;
            throw new Error(errorMsg);
          }
        } else if (json.success && Array.isArray(json.notes)) {
          setCategoryNotes((prevNotes) => {
            const newNotes = json.notes;
            // Append new notes if not resetting, otherwise replace
            return needsReset
              ? newNotes
              : [
                  ...prevNotes,
                  // Filter out potential duplicates if API sends overlapping items (shouldn't happen with lastId)
                  ...newNotes.filter(
                    (n) => !prevNotes.some((p) => p._id === n._id),
                  ),
                ];
          });
          setCategoryLastId(json.nextLastId);
          setHasMoreCategoryNotes(json.hasMore);
          console.log(
            `Category notes fetch success. Fetched: ${json.notes.length}, Has More: ${json.hasMore}, Next Last ID: ${json.nextLastId}`,
          );
        } else {
          // Handle cases where API returns 200 OK but success=false or invalid data
          console.error(
            "Category notes fetch API reported success=false or missing notes array:",
            json.error,
          );
          setHasMoreCategoryNotes(false); // Assume no more if data is invalid
          if (needsReset) setCategoryNotes([]); // Ensure notes are empty if reset and invalid data
        }
      } catch (err) {
        console.error(`Error fetching notes for category ${categoryId}:`, err);
        setCategoryError(err.message || "Failed to fetch category notes."); // Set specific error
        setHasMoreCategoryNotes(false); // Stop fetching on error
        if (needsReset) setCategoryNotes([]); // Ensure notes are empty if reset on error
      } finally {
        setIsFetchingCategoryNotes(false); // Always set fetching to false
      }
    },
    [
      host,
      isFetchingCategoryNotes,
      hasMoreCategoryNotes,
      categoryLastId,
      currentCategoryId, // Important dependency to detect category changes
      // Include setters used inside
      setIsFetchingCategoryNotes,
      setCategoryNotes,
      setCategoryLastId,
      setHasMoreCategoryNotes,
      setCategoryError,
      setCurrentCategoryId,
    ], // Dependencies
  );

  const getNotes = useCallback(async () => {
    console.log("Fetching user-specific notes...");
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("getNotes: No token found.");
      setNotes([]); // Clear notes if no token
      return []; // Return empty array
    }

    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! Status: ${response.status}`,
        );
      }
      const json = await response.json();
      setNotes(json);
      console.log("User-specific notes fetched:", json.length);
      return json; // Return the fetched notes
    } catch (error) {
      console.error("Error fetching user-specific notes:", error);
      setNotes([]); // Clear notes on error
      return []; // Return empty array on error
    }
  }, [host]); // Dependency

  // --- Add Note Definition ---
  const addNote = useCallback(
    async (noteData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("addNote: Authentication token not found.");
        return { success: false, message: "Authentication required." };
      }
      console.log("Adding note with category ID:", noteData.categoryId);

      try {
        const payload = {
          title: noteData.title,
          description: noteData.description,
          tag: noteData.tag || "General", // Default tag if empty
          category: noteData.categoryId, // Send category ID
          isFeatured: noteData.isFeatured || false,
        };

        const response = await fetch(`${host}/api/notes/addnote`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify(payload),
        });

        const addedNote = await response.json(); // Parse response regardless of status

        if (!response.ok) {
          // Handle validation errors or other server errors
          const errorMessage = addedNote.errors
            ? addedNote.errors.map((e) => e.msg).join(", ") // Joi validation errors
            : addedNote.error || "Failed to add note."; // General server error
          console.error("Add note failed:", errorMessage);
          return { success: false, message: errorMessage };
        }

        console.log("Note added successfully (raw):", addedNote);

        // Update relevant state slices
        setNotes((prevUserNotes) => [addedNote, ...prevUserNotes]); // Add to user's notes (My Notes page)
        setAllNotes((prevAllNotes) => [addedNote, ...prevAllNotes]); // Add to global notes list (Home page)
        setRecentPosts((prevRecent) => [addedNote, ...prevRecent].slice(0, 5)); // Add to recent posts sidebar

        // Add to featured if applicable
        if (addedNote.isFeatured) {
          setFeaturedNotes((prev) => [addedNote, ...prev].slice(0, 5)); // Assuming featured is also limited
        }

        // Refresh sidebar if the added note is in the currently viewed category list
        const addedNoteCategoryId = addedNote.category?._id;
        if (
          addedNoteCategoryId &&
          categoryNotesList.length > 0 &&
          categoryNotesList[0]?.category?._id === addedNoteCategoryId // Fix: Compare IDs
        ) {
          console.log(
            "[addNote] Refreshing sidebar list (note added to currently viewed category).",
          );
          fetchAllNotesByCategory(addedNoteCategoryId);
        } else if (
          addedNoteCategoryId &&
          currentCategoryId === addedNoteCategoryId
        ) {
          // This case might be redundant if the above covers it, but good for clarity
          console.log(
            "[addNote] Refreshing sidebar list (note added to category matching CategoryPage).",
          );
          fetchAllNotesByCategory(addedNoteCategoryId);
        }

        return { success: true, note: addedNote };
      } catch (error) {
        console.error("Error in addNote:", error);
        return {
          success: false,
          message: error.message || "An unexpected error occurred.",
        };
      }
    },
    [host, fetchAllNotesByCategory, categoryNotesList, currentCategoryId], // Dependencies
  );

  // --- Delete Note Definition ---
  const deleteNote = useCallback(
    async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("deleteNote: Authentication token not found.");
        throw new Error("Authentication required to delete a note.");
      }
      console.log("Deleting note:", id);

      try {
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "auth-token": token },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! Status: ${response.status}`,
          );
        }

        const json = await response.json();
        console.log(
          json.success
            ? "Note deleted on backend."
            : "Backend reported issue deleting note.",
        );

        // Update all relevant state arrays
        const filterNote = (prev) => prev.filter((note) => note._id !== id);
        setNotes(filterNote);
        setAllNotes(filterNote);
        setFeaturedNotes(filterNote);
        setRecentPosts(filterNote);
        setCategoryNotes(filterNote);
        setSearchResults(filterNote);
        setCategoryNotesList(filterNote); // Update sidebar list too
      } catch (error) {
        console.error("Error deleting note:", error);
        throw error; // Re-throw to allow UI to handle it
      }
    },
    [host], // Dependency
  );

  // --- Edit Note Definition ---
  const editNote = useCallback(
    async (id, title, description, tag, categoryId, isFeatured) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("editNote: Authentication token not found.");
        throw new Error("Authentication required to edit a note.");
      }
      console.log("Editing note:", id, "with category ID:", categoryId);

      // Find the old note's category ID *before* making the API call
      const oldNote = [
        ...notes,
        ...allNotes,
        ...categoryNotes,
        ...categoryNotesList,
      ].find((n) => n._id === id);
      const oldCategoryId = oldNote?.category?._id;

      try {
        const payload = {
          title,
          description,
          tag: tag || "", // Ensure tag is at least an empty string
          category: categoryId, // Send the new category ID
          isFeatured, // Send the featured status (might be undefined if user isn't admin)
        };

        // Remove undefined properties (like isFeatured for non-admins)
        Object.keys(payload).forEach(
          (key) => payload[key] === undefined && delete payload[key],
        );

        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify(payload),
        });

        const updatedNoteResponse = await response.json(); // Parse response

        if (!response.ok) {
          // Handle validation or server errors
          const errorMessage = updatedNoteResponse.errors
            ? updatedNoteResponse.errors.map((e) => e.msg).join(", ")
            : updatedNoteResponse.error ||
              `HTTP error! Status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const updatedNote = updatedNoteResponse.note; // Get the updated note from response
        if (!updatedNote)
          throw new Error("Backend response did not contain the updated note.");

        console.log("Note updated successfully (raw):", updatedNote);

        // Function to update a single note in an array
        const updateState = (prevNotes) =>
          prevNotes.map((n) => (n._id === id ? { ...updatedNote } : n));

        // Update all relevant states
        setNotes(updateState);
        setAllNotes(updateState);
        setCategoryNotes(updateState); // If it was part of category-specific view
        setSearchResults(updateState); // If it was part of search results
        setCategoryNotesList(updateState); // Update the sidebar list state

        // Update featured notes state
        setFeaturedNotes((prev) => {
          const existingIndex = prev.findIndex((n) => n._id === id);
          let newFeatured = [...prev];
          if (updatedNote.isFeatured) {
            if (existingIndex !== -1) {
              // Update existing featured note
              newFeatured[existingIndex] = updatedNote;
            } else {
              // Add new note to featured and re-sort (optional, depends on desired order)
              newFeatured.unshift(updatedNote);
              newFeatured.sort((a, b) => new Date(b.date) - new Date(a.date)); // Example: sort by date
            }
          } else {
            // Remove if it's no longer featured
            if (existingIndex !== -1) {
              newFeatured.splice(existingIndex, 1);
            }
          }
          return newFeatured;
        });

        // Update recent posts state
        setRecentPosts((prev) =>
          prev.map((n) => (n._id === id ? updatedNote : n)),
        );

        // --- Sidebar List Refresh Logic ---
        const newCategoryId = updatedNote.category?._id;

        // If the category *changed*, refresh the list for the OLD category (to remove the note)
        // AND the NEW category (to add the note, if that list is currently displayed)
        if (oldCategoryId && newCategoryId && oldCategoryId !== newCategoryId) {
          console.log(
            `[editNote] Category changed from ${oldCategoryId} to ${newCategoryId}. Refreshing sidebar for old category.`,
          );
          fetchAllNotesByCategory(oldCategoryId); // Refresh old category list
          // Check if the *new* category is currently displayed in the sidebar
          if (
            categoryNotesList.length > 0 &&
            categoryNotesList[0]?.category?._id === newCategoryId
          ) {
            console.log(
              `[editNote] Also refreshing sidebar for new category ${newCategoryId} as it's currently displayed.`,
            );
            fetchAllNotesByCategory(newCategoryId);
          }
        }
        // If the category did NOT change, but the edited note belongs to the category *currently shown in the sidebar*, refresh that list
        else if (
          newCategoryId &&
          categoryNotesList.length > 0 &&
          categoryNotesList[0]?.category?._id === newCategoryId
        ) {
          console.log(
            `[editNote] Refreshing sidebar list for category ${newCategoryId} after edit (category unchanged but list is active).`,
          );
          fetchAllNotesByCategory(newCategoryId);
        }
        // --- End Sidebar List Refresh Logic ---
      } catch (error) {
        console.error("Error editing note:", error);
        throw error; // Re-throw to allow UI to handle it
      }
    },
    [
      host,
      fetchAllNotesByCategory,
      notes, // Include states used to find oldNote
      allNotes,
      categoryNotes,
      categoryNotesList, // Include state used for sidebar refresh logic
    ], // Dependencies
  );

  const fetchSearchResults = useCallback(
    async (query) => {
      if (!query || query.trim() === "") {
        setSearchResults([]);
        setSearchError(null);
        setIsSearching(false);
        return;
      }
      console.log(`Searching for: "${query}"`);
      setIsSearching(true);
      setSearchError(null);
      setSearchResults([]); // Clear previous results

      try {
        const encodedQuery = encodeURIComponent(query);
        const url = `${host}/api/notes/search?query=${encodedQuery}&limit=20`; // Limit search results
        console.log("Fetching search URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Improved error handling for non-JSON responses
        const text = await response.text();
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json"))
          throw new Error(
            `Expected JSON, but received ${contentType}: ${text.slice(0, 100)}`,
          );

        const json = JSON.parse(text); // Safely parse after checking content type

        if (!response.ok)
          throw new Error(
            json.error || `HTTP error! Status: ${response.status}`,
          );

        if (json.success && json.notes) {
          setSearchResults(json.notes);
          console.log("Search results fetched:", json.notes.length);
        } else {
          // Handle cases where API reports success=false or notes array is missing
          console.error("Search failed:", json.error || "No notes found");
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchError(error.message || "Failed to fetch search results.");
        setSearchResults([]); // Ensure results are empty on error
      } finally {
        setIsSearching(false); // Always set searching to false
      }
    },
    [host], // Dependency
  );

  const fetchCategoryTree = useCallback(async () => {
    if (isFetchingCategories) {
      console.log("Category tree fetch skipped (already fetching).");
      return;
    }
    console.log("Fetching category tree structure...");
    setIsFetchingCategories(true);
    setCategoryTreeError(null); // Clear previous errors
    try {
      const response = await fetch(`${host}/api/categories/tree/structured`);
      if (!response.ok)
        throw new Error(`HTTP error fetching tree! status: ${response.status}`);

      const json = await response.json();
      if (json.success && Array.isArray(json.categoryTree)) {
        setCategoryTree(json.categoryTree);

        // Helper function to flatten the tree into a list
        const flattenTree = (nodes) => {
          let list = [];
          nodes.forEach((node) => {
            list.push({
              // Push the node itself
              _id: node._id,
              name: node.name,
              description: node.description,
              parent: node.parent, // Keep parent ID if needed
            });
            // Recursively flatten children
            if (node.children && node.children.length > 0)
              list = list.concat(flattenTree(node.children));
          });
          return list;
        };
        setCategories(flattenTree(json.categoryTree)); // Update the flat list state
        console.log("Category tree and flat list updated successfully.");
      } else {
        // Handle API error or unexpected data structure
        console.error("Failed to fetch category tree:", json.error);
        setCategoryTree([]); // Reset tree state
        setCategories([]); // Reset flat list state
        setCategoryTreeError(
          json.error || "Failed to process category tree data.",
        );
      }
    } catch (err) {
      // Handle network errors
      console.error("Network error fetching category tree:", err);
      setCategoryTree([]);
      setCategories([]);
      setCategoryTreeError(
        err.message || "Network error loading category tree.",
      );
    } finally {
      setIsFetchingCategories(false); // Always set fetching state to false
    }
  }, [host, isFetchingCategories]); // Dependencies

  // This function ensures categories are loaded, useful before forms that need them
  const getCategories = useCallback(async () => {
    console.log(
      "Ensuring categories are loaded (relies on fetchCategoryTree)...",
    );
    // Only fetch if categories are empty AND not currently fetching
    if (categories.length === 0 && !isFetchingCategories) {
      await fetchCategoryTree(); // Await the fetch if needed
    }
    // If already fetching, let the existing fetch complete.
    // If categories exist, do nothing.
  }, [categories.length, isFetchingCategories, fetchCategoryTree]); // Dependencies

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

        await fetchCategoryTree(); // Refresh the category tree and flat list
        return { success: true, category: result.category };
      } catch (error) {
        console.error("Error adding category:", error);
        return { success: false, message: error.message };
      }
    },
    [host, fetchCategoryTree], // Dependencies
  );

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

        await fetchCategoryTree(); // Refresh the category tree and flat list
        return { success: true, category: result.category };
      } catch (error) {
        console.error("Error updating category:", error);
        return { success: false, message: error.message };
      }
    },
    [host, fetchCategoryTree], // Dependencies
  );

  // Effect to run initial data fetches on component mount
  useEffect(() => {
    if (!initialFetchInitiated.current) {
      console.log("NoteState: Running initial data fetches...");
      fetchFeaturedNotesBatch(true); // Fetch first batch of featured notes
      fetchNextBatchOfNotes(); // Fetch first batch of all notes
      fetchCategoryTree(); // Fetch category structure
      getRecentPosts(); // Fetch recent posts for sidebar
      initialFetchInitiated.current = true; // Mark initial fetches as done
    }
    // No dependencies needed here as it should only run once on mount
  }, []); // Empty dependency array ensures this runs only once

  const contextValue = useMemo(
    () => ({
      // State Values
      notes, // User-specific notes (for MyNotesPage)
      allNotes, // All notes for public view (HomePage)
      note, // Single note details (for SingleBlogPage)
      categories, // Flat list of categories (for dropdowns, etc.)
      categoryNotes, // Notes for a specific category (CategoryPage)
      currentCategoryDetails, // Details of the category being viewed
      featuredNotes, // Featured notes list
      recentPosts, // Recent posts list (for Sidebar)
      searchResults, // Search results list
      categoryTree, // Hierarchical category structure (for tree views)
      categoryNotesList, // List of note titles for a category (BlogSidebar)

      // Loading States
      isFetching, // Loading more 'allNotes'
      isFetchingNote, // Loading single note by slug
      isFetchingCategories, // Loading categories/tree
      isFetchingCategoryNotes, // Loading more 'categoryNotes'
      isInitialFeaturedLoading, // Initial load of featured notes
      isFetchingMoreFeatured, // Loading more featured notes
      isSearching, // Loading search results
      isFetchingCategoryNotesList, // Loading sidebar note list

      // Pagination/Status States
      hasMore, // More 'allNotes' available?
      hasMoreCategoryNotes, // More 'categoryNotes' available?
      hasMoreFeatured, // More 'featuredNotes' available?
      initialLoadDone, // Has the first batch of 'allNotes' loaded?

      // Error States
      error, // General/Single Note error
      searchError, // Search specific error
      categoryError, // Category Page specific error
      categoryTreeError, // Error loading category structure
      categoryNotesListError, // Error loading sidebar note list

      // Functions (Actions)
      addNote,
      deleteNote,
      editNote,
      getNotes, // Get user-specific notes
      getCategories, // Ensure categories are loaded (uses fetchCategoryTree)
      getCategoryDetailsById, // Get details for a specific category ID
      fetchNextBatchOfNotes, // Fetch next page of 'allNotes'
      fetchCategoryNotesBatch, // Fetch notes for a specific category ID (paginated)
      fetchNoteBySlug, // Fetch a single note by its slug
      getRecentPosts, // Fetch recent posts
      fetchFeaturedNotesBatch, // Fetch featured notes (paginated)
      fetchSearchResults, // Fetch search results
      fetchCategoryTree, // Fetch category hierarchy
      addCategory, // Admin action
      updateCategory, // Admin action
      fetchAllNotesByCategory, // Fetch all note titles for a category (for BlogSidebar)
    }),
    // Include all state values and functions in the dependency array
    [
      notes,
      allNotes,
      note,
      categories,
      categoryNotes,
      currentCategoryDetails,
      featuredNotes,
      recentPosts,
      searchResults,
      categoryTree,
      categoryNotesList,
      hasMore,
      isFetching,
      isFetchingNote,
      hasMoreCategoryNotes,
      isFetchingCategoryNotes,
      hasMoreFeatured,
      isInitialFeaturedLoading,
      isFetchingMoreFeatured,
      isSearching,
      initialLoadDone,
      isFetchingCategories,
      isFetchingCategoryNotesList,
      error,
      searchError,
      categoryError,
      categoryTreeError,
      categoryNotesListError,
      addNote,
      deleteNote,
      editNote,
      getNotes,
      getCategories,
      getCategoryDetailsById,
      fetchNextBatchOfNotes,
      fetchCategoryNotesBatch,
      fetchNoteBySlug,
      getRecentPosts,
      fetchFeaturedNotesBatch,
      fetchSearchResults,
      fetchCategoryTree,
      addCategory,
      updateCategory,
      fetchAllNotesByCategory,
    ],
  );

  return (
    <NoteContext.Provider value={contextValue}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
