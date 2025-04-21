// src/context/Notes/NoteState.js
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
  const [notes, setNotes] = useState([]); // User-specific notes for MyNotesPage
  const [allNotes, setAllNotes] = useState([]); // All notes for public view (paginated)
  const [hasMore, setHasMore] = useState(true); // For allNotes pagination
  const [lastId, setLastId] = useState(null); // For allNotes pagination
  const [isFetching, setIsFetching] = useState(false); // For allNotes pagination
  const [initialLoadDone, setInitialLoadDone] = useState(false); // For allNotes
  const [note, setNote] = useState(null); // Single note for display/edit
  const [isFetchingNote, setIsFetchingNote] = useState(false); // Loading single note
  const [error, setError] = useState(null); // General/List error
  const [singleNoteError, setSingleNoteError] = useState(null); // Error for single note fetch
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

  const initialFetchInitiated = useRef(false);

  // Fetch user-specific notes (for MyNotesPage)
  const getNotes = useCallback(async () => {
    // ... (keep existing implementation)
    console.log("Fetching user-specific notes...");
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("getNotes: No token found.");
      setNotes([]);
      return [];
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
      return json;
    } catch (fetchError) {
      console.error("Error fetching user-specific notes:", fetchError);
      setNotes([]);
      setError(fetchError.message || "Failed to load your notes.");
      return [];
    }
  }, [host]);

  // Fetch paginated notes for public view (HomeScreen)
  const fetchNextBatchOfNotes = useCallback(async () => {
    // ... (keep existing implementation)
    if (isFetching || !hasMore) return;
    console.log("Fetch initiated for allNotes. Current lastId:", lastId);
    setIsFetching(true);
    setError(null);
    const limit = 9;
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
        setLastId(newLastId);
        setHasMore(json.hasMore);
        console.log(
          "Fetch successful. New lastId:",
          newLastId,
          "Has More:",
          json.hasMore,
        );
        if (!initialLoadDone) {
          console.log("Setting initialLoadDone = true");
          setInitialLoadDone(true);
        }
      } else {
        console.error(
          "API Error or invalid data:",
          json.error || "No notes array received",
        );
        setHasMore(false);
      }
    } catch (fetchError) {
      console.error("Error fetching next batch of notes:", fetchError);
      setError(fetchError.message);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  }, [host, lastId, hasMore, isFetching, initialLoadDone]);

  // Fetch a single note by its ID (securely, for editing)
  const getNoteById = useCallback(
    async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("getNoteById: No token found.");
        setSingleNoteError("Authentication required.");
        setNote(null);
        return null;
      }
      if (!id) {
        // Basic validation
        console.error("getNoteById: Invalid ID provided:", id);
        setSingleNoteError("Invalid Note ID format.");
        setNote(null);
        setIsFetchingNote(false);
        return null;
      }

      console.log(`Attempting to fetch note by ID: ${id}`);
      setIsFetchingNote(true);
      setSingleNoteError(null); // Clear previous single note errors
      setNote(null); // Clear previous note state

      try {
        // **ASSUMPTION:** Using the existing /fetchNotesIrrespective/:id and relying on fetchuser middleware
        // Ideally, this endpoint should *explicitly* check ownership/admin rights.
        // If you create a new dedicated endpoint like /api/notes/note/:id, update the URL below.
        const response = await fetch(
          `${host}/api/notes/fetchNotesIrrespective/${id}`,
          {
            method: "GET", // Changed to GET as per standard REST for fetching by ID
            headers: {
              "Content-Type": "application/json",
              "auth-token": token, // Sending token for authentication
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          // Handle specific auth errors if the backend sends them
          if (response.status === 401 || response.status === 403) {
            setSingleNoteError(
              data.error || "You are not authorized to view or edit this note.",
            );
          } else if (response.status === 404) {
            setSingleNoteError(data.error || "Note not found.");
          } else {
            setSingleNoteError(
              data.error || `Server error (${response.status})`,
            );
          }
          setNote(null);
          console.error(
            `Failed to fetch note by ID (${id}): ${response.status} - ${
              data.error || "Unknown error"
            }`,
          );
          return null;
        } else {
          setNote(data);
          setSingleNoteError(null);
          console.log(
            `Single note fetched successfully by ID (Title: ${data.title})`,
          );
          return data; // Return the fetched note
        }
      } catch (err) {
        console.error(
          "Network or parsing error fetching single note by ID:",
          err,
        );
        setSingleNoteError(
          err.message || "Failed to fetch note due to a network issue.",
        );
        setNote(null);
        return null;
      } finally {
        setIsFetchingNote(false);
      }
    },
    [host],
  );

  // Fetch a single note by Slug (publicly)
  const fetchNoteBySlug = useCallback(
    async (slug) => {
      // ... (keep existing implementation, ensure using singleNoteError)
      if (!slug) {
        console.warn("fetchNoteBySlug called with empty slug.");
        setSingleNoteError("Invalid post URL."); // Use singleNoteError
        setNote(null);
        setIsFetchingNote(false);
        return;
      }
      console.log(`Attempting to fetch note by SLUG: ${slug}`);
      setIsFetchingNote(true);
      setSingleNoteError(null); // Clear previous single note errors
      setNote(null);
      try {
        const response = await fetch(
          `${host}/api/notes/fetchNoteBySlug/${slug}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const data = await response.json();
        if (!response.ok) {
          const errorMessage =
            data.error || `Could not find post (Status: ${response.status})`;
          setSingleNoteError(errorMessage); // Use singleNoteError
          setNote(null);
          console.error(
            `Workspace note by slug failed (slug: ${slug}):`,
            errorMessage,
          );
        } else {
          setNote(data);
          setSingleNoteError(null); // Clear error on success
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
        setSingleNoteError(
          err.message || "Failed to fetch note due to a network issue.",
        ); // Use singleNoteError
        setNote(null);
      } finally {
        setIsFetchingNote(false);
      }
    },
    [host],
  );

  // Add Note
  const addNote = useCallback(
    async (noteData) => {
      // ... (keep existing implementation, ensure error state is cleared appropriately if needed)
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("addNote: Authentication token not found.");
        return { success: false, message: "Authentication required." };
      }
      console.log("Adding note with data:", noteData);
      setError(null); // Clear general errors before adding
      try {
        const payload = {
          title: noteData.title,
          description: noteData.description,
          tag: noteData.tag || "General",
          category: noteData.categoryId,
          isFeatured: noteData.isFeatured || false,
        };
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify(payload),
        });
        const addedNote = await response.json();
        if (!response.ok) {
          const errorMessage = addedNote.errors
            ? addedNote.errors.map((e) => e.msg).join(", ")
            : addedNote.error || "Failed to add note.";
          console.error("Add note failed:", errorMessage);
          setError(errorMessage); // Set general error if add fails
          return { success: false, message: errorMessage };
        }
        console.log("Note added successfully (raw):", addedNote);
        // Optimistically update lists (could refetch if strict consistency needed)
        setNotes((prevUserNotes) => [addedNote, ...prevUserNotes]);
        setAllNotes((prevAllNotes) => [addedNote, ...prevAllNotes]); // Add to the beginning for recency
        setRecentPosts((prevRecent) => [addedNote, ...prevRecent].slice(0, 5));
        if (addedNote.isFeatured) {
          setFeaturedNotes((prev) => [addedNote, ...prev].slice(0, 10)); // Adjust limit if needed
        }
        return { success: true, note: addedNote };
      } catch (error) {
        console.error("Error in addNote:", error);
        setError(error.message || "An unexpected error occurred."); // Set general error
        return {
          success: false,
          message: error.message || "An unexpected error occurred.",
        };
      }
    },
    [host],
  );

  // Delete Note
  const deleteNote = useCallback(
    async (id) => {
      // ... (keep existing implementation)
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("deleteNote: Authentication token not found.");
        throw new Error("Authentication required to delete a note.");
      }
      console.log("Deleting note:", id);
      setError(null); // Clear error before delete
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
        // Update all relevant states
        const filterNote = (prev) => prev.filter((note) => note._id !== id);
        setNotes(filterNote);
        setAllNotes(filterNote);
        setFeaturedNotes(filterNote);
        setRecentPosts(filterNote);
        setSearchResults(filterNote);
      } catch (error) {
        console.error("Error deleting note:", error);
        setError(error.message || "Failed to delete note."); // Set general error
        throw error;
      }
    },
    [host],
  );

  // Edit Note
  const editNote = useCallback(
    async (id, title, description, tag, categoryId, isFeatured) => {
      // ... (keep existing implementation, ensure error state is cleared)
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("editNote: Authentication token not found.");
        throw new Error("Authentication required to edit a note.");
      }
      console.log("Editing note:", id, "with data:", {
        title,
        tag,
        categoryId,
        isFeatured,
        // description omitted for brevity
      });
      setError(null); // Clear error before edit attempt
      try {
        const payload = {
          title,
          description,
          tag: tag || "",
          category: categoryId,
          isFeatured,
        };
        // Remove undefined fields (important if admin status changes isFeatured)
        Object.keys(payload).forEach(
          (key) => payload[key] === undefined && delete payload[key],
        );

        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify(payload),
        });
        const updatedNoteResponse = await response.json();
        if (!response.ok) {
          const errorMessage = updatedNoteResponse.errors
            ? updatedNoteResponse.errors.map((e) => e.msg).join(", ")
            : updatedNoteResponse.error ||
              `HTTP error! Status: ${response.status}`;
          throw new Error(errorMessage);
        }
        const updatedNote = updatedNoteResponse.note;
        if (!updatedNote)
          throw new Error("Backend response did not contain the updated note.");

        console.log("Note updated successfully (raw):", updatedNote);

        // Update all relevant states
        const updateState = (prevNotes) =>
          prevNotes.map((n) => (n._id === id ? { ...updatedNote } : n));
        setNotes(updateState);
        setAllNotes(updateState);
        setSearchResults(updateState);
        setFeaturedNotes((prev) => {
          const existingIndex = prev.findIndex((n) => n._id === id);
          let newFeatured = [...prev];
          if (updatedNote.isFeatured) {
            if (existingIndex !== -1) {
              newFeatured[existingIndex] = updatedNote; // Update in place
            } else {
              // Add if it wasn't featured before but now is
              newFeatured.unshift(updatedNote);
              newFeatured.sort((a, b) => new Date(b.date) - new Date(a.date)); // Re-sort if needed
              newFeatured = newFeatured.slice(0, 10); // Limit if necessary
            }
          } else {
            // Remove if it was featured but now isn't
            if (existingIndex !== -1) {
              newFeatured.splice(existingIndex, 1);
            }
          }
          return newFeatured;
        });
        setRecentPosts((prev) =>
          prev.map((n) => (n._id === id ? updatedNote : n)),
        );

        // If the currently viewed single note is the one edited, update it too
        if (note && note._id === id) {
          setNote(updatedNote);
        }
      } catch (error) {
        console.error("Error editing note:", error);
        setError(error.message || "Failed to update note."); // Set general error
        throw error;
      }
    },
    [host, note],
  ); // Add note to dependency array

  // Fetch Recent Posts (No changes needed)
  const getRecentPosts = useCallback(
    async (limit = 5) => {
      // ... (keep existing implementation)
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
    [host],
  );

  // Fetch Featured Notes Batch (No changes needed)
  const fetchFeaturedNotesBatch = useCallback(
    async (isInitialLoad = false, retryCount = 0) => {
      // ... (keep existing implementation)
      const maxRetries = 3;
      const isLoading = isInitialLoad
        ? isInitialFeaturedLoading
        : isFetchingMoreFeatured;
      const setLoading = isInitialLoad
        ? setIsInitialFeaturedLoading
        : setIsFetchingMoreFeatured;

      if (isLoading || (!isInitialLoad && !hasMoreFeatured)) {
        console.log(
          `Featured fetch skipped. Loading: ${isLoading}, HasMore: ${hasMoreFeatured}, Initial: ${isInitialLoad}`,
        );
        return;
      }

      console.log(
        `Workspaceing featured batch. Initial: ${isInitialLoad}, Last ID: ${featuredLastId}`,
      );
      setLoading(true);
      setError(null);
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
        if (!response.ok)
          throw new Error(
            json.error || `HTTP error! Status: ${response.status}`,
          );

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
          console.log("No more featured notes or API success=false.");
          setHasMoreFeatured(false);
        }
      } catch (error) {
        console.error("Error fetching featured notes:", error);
        if (retryCount < maxRetries) {
          console.log(`Retrying fetch featured... Attempt ${retryCount + 1}`);
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

  // Fetch Search Results (No changes needed)
  const fetchSearchResults = useCallback(
    async (query) => {
      // ... (keep existing implementation)
      if (!query || query.trim() === "") {
        setSearchResults([]);
        setSearchError(null);
        setIsSearching(false);
        return;
      }
      console.log(`Searching for: "${query}"`);
      setIsSearching(true);
      setSearchError(null);
      setSearchResults([]);
      try {
        const encodedQuery = encodeURIComponent(query);
        const url = `${host}/api/notes/search?query=${encodedQuery}&limit=20`;
        console.log("Fetching search URL:", url);
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const contentType = response.headers.get("Content-Type");
        const text = await response.text();
        if (!contentType || !contentType.includes("application/json")) {
          console.error(
            `Search expected JSON, received ${contentType}: ${text.slice(
              0,
              100,
            )}`,
          );
          throw new Error(`Server returned an unexpected response format.`);
        }
        const json = JSON.parse(text);
        if (!response.ok)
          throw new Error(
            json.error || `HTTP error! Status: ${response.status}`,
          );
        if (json.success && json.notes) {
          setSearchResults(json.notes);
          console.log("Search results fetched:", json.notes.length);
        } else {
          console.error("Search failed:", json.error || "No notes found");
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchError(error.message || "Failed to fetch search results.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [host],
  );

  // Initial data fetch
  useEffect(() => {
    if (!initialFetchInitiated.current) {
      console.log("NoteState: Running initial data fetches...");
      fetchFeaturedNotesBatch(true);
      fetchNextBatchOfNotes();
      getRecentPosts();
      initialFetchInitiated.current = true;
    }
  }, [fetchFeaturedNotesBatch, fetchNextBatchOfNotes, getRecentPosts]);

  const contextValue = useMemo(
    () => ({
      notes,
      allNotes,
      note,
      featuredNotes,
      recentPosts,
      searchResults,
      isFetching,
      isFetchingNote,
      isInitialFeaturedLoading,
      isFetchingMoreFeatured,
      isSearching,
      hasMore,
      hasMoreFeatured,
      initialLoadDone,
      error, // General error
      singleNoteError, // Specific error for single note fetches
      searchError,
      addNote,
      deleteNote,
      editNote,
      getNotes,
      fetchNextBatchOfNotes,
      fetchNoteBySlug,
      getNoteById, // Added function
      getRecentPosts,
      fetchFeaturedNotesBatch,
      fetchSearchResults,
    }),
    [
      notes,
      allNotes,
      note,
      featuredNotes,
      recentPosts,
      searchResults,
      isFetching,
      isFetchingNote,
      isInitialFeaturedLoading,
      isFetchingMoreFeatured,
      isSearching,
      hasMore,
      hasMoreFeatured,
      initialLoadDone,
      error,
      singleNoteError, // Added state
      searchError,
      addNote,
      deleteNote,
      editNote,
      getNotes,
      fetchNextBatchOfNotes,
      fetchNoteBySlug,
      getNoteById, // Added function
      getRecentPosts,
      fetchFeaturedNotesBatch,
      fetchSearchResults,
    ],
  );

  return (
    <NoteContext.Provider value={contextValue}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
