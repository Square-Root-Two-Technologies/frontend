// src/context/notes/NoteState.js
import NoteContext from "./NoteContext";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

const NoteState = (props) => {
  //const host = "http://localhost:5000"; // Your backend host
  const host = process.env.REACT_APP_BACKEND;

  // State Variables
  const [notes, setNotes] = useState([]); // User-specific notes
  const [allNotes, setAllNotes] = useState([]); // All public notes for home feed
  const [note, setNote] = useState(null); // State for single note page
  const [hasMore, setHasMore] = useState(true); // Pagination flag for allNotes
  const [lastId, setLastId] = useState(null); // ID for pagination cursor
  const [isFetching, setIsFetching] = useState(false); // General loading indicator (mainly for pagination)
  const [error, setError] = useState(null); // Error state for fetching single note
  const [initialLoadDone, setInitialLoadDone] = useState(false); // Flag for initial data load completion
  const [featuredNotes, setFeaturedNotes] = useState([]); // Featured notes for home
  const [featuredLastId, setFeaturedLastId] = useState(null);
  const [hasMoreFeatured, setHasMoreFeatured] = useState(true);
  //const [isFetchingFeatured, setIsFetchingFeatured] = useState(false);
  const [blogTypes, setBlogTypes] = useState([]); // Unique blog types/categories
  const [recentPosts, setRecentPosts] = useState([]); // Recent posts for sidebar
  // NEW: Separate loading flags for featured notes
  const [isInitialFeaturedLoading, setIsInitialFeaturedLoading] =
    useState(false);
  const [isFetchingMoreFeatured, setIsFetchingMoreFeatured] = useState(false); // For subsequent loads

  const initialFetchInitiated = useRef(false);

  // --- Public Note Fetching (Home Page, Sidebar, etc.) ---

  // FEATURED NOTES BATCH FETCHER (Handles Initial & Subsequent)
  const fetchFeaturedNotesBatch = useCallback(
    async (isInitialLoad = false, retryCount = 0) => {
      const maxRetries = 3;
      const isLoading = isInitialLoad
        ? isInitialFeaturedLoading
        : isFetchingMoreFeatured;
      const setLoading = isInitialLoad
        ? setIsInitialFeaturedLoading
        : setIsFetchingMoreFeatured;

      if (isLoading || (!isInitialLoad && !hasMoreFeatured)) {
        return;
      }

      console.log(
        `Fetching featured batch. Initial: ${isInitialLoad}, Last ID: ${featuredLastId}`,
      );
      setLoading(true);

      const limit = 5;
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

        if (!response.ok) {
          throw new Error(
            json.error || `HTTP error! Status: ${response.status}`,
          );
        }

        if (json.success && json.notes) {
          setFeaturedNotes((prevNotes) => {
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

          setFeaturedLastId(json.nextLastId);
          setHasMoreFeatured(json.hasMore);
        } else {
          setHasMoreFeatured(false);
        }
      } catch (error) {
        console.error("Error fetching featured notes:", error);
        if (retryCount < maxRetries) {
          console.log(`Retrying fetch... Attempt ${retryCount + 1}`);
          setTimeout(() => {
            fetchFeaturedNotesBatch(isInitialLoad, retryCount + 1);
          }, 1000 * (retryCount + 1));
        } else {
          setError("Failed to fetch featured notes after retries.");
          setHasMoreFeatured(false);
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
    ],
  );

  const getFeaturedNotes = useCallback(
    async (limit = 3) => {
      console.log("Fetching featured notes...");
      try {
        const response = await fetch(
          `${host}/api/notes/featured?limit=${limit}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const json = await response.json();
        if (json.success) {
          setFeaturedNotes(json.notes);
          console.log("Featured notes fetched:", json.notes.length);
        } else console.error("Failed to fetch featured notes:", json.error);
      } catch (error) {
        console.error("Network error fetching featured notes:", error);
      }
    },
    [host],
  );

  const getBlogTypes = useCallback(async () => {
    console.log("Fetching blog types...");
    try {
      const response = await fetch(`${host}/api/notes/types`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await response.json();
      if (json.success && Array.isArray(json.types)) {
        setBlogTypes(["All", ...json.types]); // Prepend "All"
        console.log("Blog types fetched:", json.types);
      } else {
        console.error("Failed to fetch blog types:", json.error);
        setBlogTypes(["All"]); // Default if fetch fails
      }
    } catch (error) {
      console.error("Network error fetching blog types:", error);
      setBlogTypes(["All"]); // Default on network error
    }
  }, [host]);

  const getRecentPosts = useCallback(
    async (limit = 5) => {
      console.log("Fetching recent posts...");
      try {
        const response = await fetch(
          `${host}/api/notes/recent?limit=${limit}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
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
    [host],
  );

  // Fetch single note by ID (for SingleBlogPage)
  const fetchNoteById = useCallback(
    async (id) => {
      console.log(`Workspaceing note by ID: ${id}`);
      setIsFetching(true); // Use general fetching flag for this too
      setError(null); // Reset error
      setNote(null); // Reset current single note
      try {
        const response = await fetch(
          `${host}/api/notes/fetchNotesIrrespective/${id}`,
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || `HTTP error! status: ${response.status}`,
          );
        }
        setNote(data); // Set the fetched note
        console.log("Single note fetched successfully.");
      } catch (err) {
        console.error("Error fetching single note:", err);
        setError(err.message || "Failed to fetch note.");
      } finally {
        setIsFetching(false);
      }
    },
    [host],
  ); // Dependencies: host

  const fetchNextBatchOfNotes = useCallback(async () => {
    // Prevent concurrent fetches or fetching when no more data exists
    if (isFetching || !hasMore) {
      // console.log("Fetch skipped: isFetching=", isFetching, "hasMore=", hasMore);
      return;
    }
    console.log("Fetch initiated for allNotes. Current lastId:", lastId);
    setIsFetching(true);
    setError(null); // Clear previous errors
    const limit = 9; // Number of notes to fetch per batch
    // Construct URL with pagination cursor (lastId) if available
    const url = `${host}/api/notes/fetchNextNote?limit=${limit}${
      lastId ? `&lastId=${lastId}` : ""
    }`;
    console.log("Fetching next batch URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await response.json(); // Parse response first

      if (!response.ok) {
        throw new Error(json.error || `HTTP error! Status: ${response.status}`);
      }

      if (json.success && json.notes) {
        setAllNotes((prevNotes) => {
          // Avoid adding duplicates if fetches overlap somehow
          const existingIds = new Set(prevNotes.map((n) => n._id));
          const newUniqueNotes = json.notes.filter(
            (n) => !existingIds.has(n._id),
          );
          // Append new notes to the existing list
          const updatedNotes = [...prevNotes, ...newUniqueNotes];
          console.log(
            `Added ${newUniqueNotes.length} new notes. Total: ${updatedNotes.length}`,
          );
          return updatedNotes;
        });

        const newLastId = json.nextLastId;
        setLastId(newLastId); // Update pagination cursor
        setHasMore(json.hasMore); // Update flag indicating if more notes exist
        console.log(
          "Fetch successful. New lastId:",
          newLastId,
          "Has More:",
          json.hasMore,
        );

        // Mark initial load as done after the first successful fetch
        if (!initialLoadDone) {
          console.log("Setting initialLoadDone = true");
          setInitialLoadDone(true);
        }
      } else {
        // Handle cases where API reports success:false or notes array is missing
        console.error(
          "API Error or invalid data:",
          json.error || "No notes array received",
        );
        setHasMore(false); // Stop fetching if data is invalid
      }
    } catch (error) {
      console.error("Error fetching next batch of notes:", error);
      setError(error.message); // Set error state
      setHasMore(false); // Stop fetching on network/parse error
    } finally {
      setIsFetching(false); // Clear loading state
    }
    // Dependencies define *when* this callback needs to be recreated
  }, [host, lastId, hasMore, isFetching, initialLoadDone]);

  // --- User-Specific Note CRUD (My Notes Page) ---

  const getNotes = useCallback(async () => {
    // Fetch user's private notes
    console.log("Fetching user-specific notes...");
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("getNotes: No token found.");
      setNotes([]); // Clear notes if not authenticated
      return;
    }
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! Status: ${response.status}`,
        );
      }
      const json = await response.json();
      setNotes(json); // Update the user-specific notes state
      console.log("User-specific notes fetched:", json.length);
    } catch (error) {
      console.error("Error fetching user-specific notes:", error);
      setNotes([]); // Reset notes on error
    }
  }, [host]);

  const addNote = useCallback(
    async (noteData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("addNote: Authentication token not found.");
        return { success: false, message: "Authentication required." };
      }
      console.log("Adding note:", noteData);
      try {
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({ ...noteData, tag: noteData.tag || "" }),
        });
        const addedNote = await response.json();
        if (!response.ok) {
          const errorMessage = addedNote.error || "Failed to add note.";
          return { success: false, message: errorMessage };
        }
        console.log("Note added successfully:", addedNote);
        setNotes((prevUserNotes) => [addedNote, ...prevUserNotes]);
        setAllNotes((prevAllNotes) => [addedNote, ...prevAllNotes]);
        if (addedNote.type && !blogTypes.includes(addedNote.type)) {
          setBlogTypes((prevTypes) => [...prevTypes, addedNote.type]);
        }
        setRecentPosts((prevRecent) => [addedNote, ...prevRecent].slice(0, 5));
        return { success: true, note: addedNote };
      } catch (error) {
        return {
          success: false,
          message: error.message || "An unexpected error occurred.",
        };
      }
    },
    [host, blogTypes],
  );

  const deleteNote = useCallback(
    async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("deleteNote: Authentication token not found.");
        throw new Error("Authentication required to delete a note."); // Throw for MyNotesPage try/catch
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
        const json = await response.json(); // Contains { Success: "...", note: deletedNote }
        console.log(json.Success); // Log backend success message

        // Update all relevant states by filtering out the deleted note
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
        setAllNotes((prevAllNotes) =>
          prevAllNotes.filter((note) => note._id !== id),
        );
        setFeaturedNotes((prev) => prev.filter((n) => n._id !== id));
        setRecentPosts((prev) => prev.filter((n) => n._id !== id));
      } catch (error) {
        console.error("Error deleting note:", error);
        throw error; // Re-throw error for component handling
      }
    },
    [host],
  ); // Dependencies: host

  const editNote = useCallback(
    async (id, title, description, tag, type, isFeatured) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("editNote: Authentication token not found.");
        throw new Error("Authentication required to edit a note.");
      }
      console.log("Editing note:", id);
      try {
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            title,
            description,
            tag: tag || "",
            type,
            isFeatured,
          }),
        });
        const updatedNoteResponse = await response.json();
        if (!response.ok) {
          const errorMessage =
            updatedNoteResponse.error ||
            `HTTP error! Status: ${response.status}`;
          throw new Error(errorMessage);
        }
        const updatedNote = updatedNoteResponse.note;
        if (!updatedNote) {
          throw new Error("Backend response did not contain the updated note.");
        }
        console.log("Note updated successfully:", updatedNote);
        const updateState = (prevNotes) =>
          prevNotes.map((note) =>
            note._id === id ? { ...note, ...updatedNote } : note,
          );
        setNotes(updateState);
        setAllNotes(updateState);
        setFeaturedNotes((prev) =>
          prev.map((n) => (n._id === id ? { ...n, ...updatedNote } : n)),
        );
        setRecentPosts((prev) =>
          prev.map((n) => (n._id === id ? { ...n, ...updatedNote } : n)),
        );
        if (updatedNote.isFeatured) {
          setFeaturedNotes((prev) => {
            const exists = prev.some((n) => n._id === id);
            if (exists)
              return prev.map((n) => (n._id === id ? updatedNote : n));
            return [updatedNote, ...prev].slice(0, 3);
          });
        } else {
          setFeaturedNotes((prev) => prev.filter((n) => n._id !== id));
        }
        if (updatedNote.type && !blogTypes.includes(updatedNote.type)) {
          setBlogTypes((prevTypes) => [
            ...new Set([...prevTypes, updatedNote.type]),
          ]);
        }
      } catch (error) {
        console.error("Error editing note:", error);
        throw error;
      }
    },
    [host, blogTypes],
  );

  // --- Initial Data Load Effect ---
  useEffect(() => {
    if (!initialFetchInitiated.current) {
      console.log("Running initial fetches...");
      fetchFeaturedNotesBatch(true); // Fetch initial featured batch
      fetchNextBatchOfNotes(); // Fetch initial main batch
      getBlogTypes();
      getRecentPosts();

      // Mark as initiated ONLY AFTER starting the fetches
      initialFetchInitiated.current = true;
    } else {
      // This log helps confirm StrictMode is causing the second run
      console.log("Skipping initial fetches on StrictMode re-run.");
    }
  }, []);

  // --- Memoized Context Value ---
  // This ensures the context value object reference only changes when underlying data changes
  const contextValue = useMemo(
    () => ({
      // State
      notes,
      allNotes,
      note,
      hasMore,
      isFetching,
      error,
      featuredNotes,
      blogTypes,
      recentPosts,
      initialLoadDone,
      // Featured Specific
      fetchFeaturedNotesBatch, // The single function to call
      hasMoreFeatured,
      isInitialFeaturedLoading, // Use for initial featured loading UI
      isFetchingMoreFeatured, // Use for subsequent featured loading UI
      // Actions
      addNote,
      deleteNote,
      editNote,
      getNotes,
      fetchNextBatchOfNotes,
      fetchNoteById,
      getBlogTypes,
      getRecentPosts,
    }),
    [
      // State Dependencies
      notes,
      allNotes,
      note,
      hasMore,
      isFetching,
      error,
      featuredNotes,
      blogTypes,
      recentPosts,
      initialLoadDone,
      hasMoreFeatured,
      isInitialFeaturedLoading,
      isFetchingMoreFeatured, // Include new loading flags
      // Callback Dependencies (stable refs)
      addNote,
      deleteNote,
      editNote,
      getNotes,
      fetchNextBatchOfNotes,
      fetchNoteById,
      getBlogTypes,
      getRecentPosts,
      fetchFeaturedNotesBatch,
    ],
  );

  // Provide the context value to children components
  return (
    <NoteContext.Provider value={contextValue}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
