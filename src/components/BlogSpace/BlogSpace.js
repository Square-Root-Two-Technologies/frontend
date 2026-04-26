import React, { useContext, useState } from "react";
import NoteContext from "../../context/Notes/NoteContext";
import NotesGrid from "../NotesGrid/NotesGrid";
import Tabs from "../Tabs/Tabs";

const BlogSpace = () => {
  const { allNotes, fetchNextBatchOfNotes, hasMore, isFetching, initialLoadDone, blogTypes } = useContext(NoteContext);
  const [activeTab, setActiveTab] = useState("All");

  const displayed =
    activeTab === "All"
      ? allNotes
      : allNotes.filter((n) => n.type?.toLowerCase() === activeTab.toLowerCase());

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <header style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: "var(--text)", margin: "0 0 0.5rem", letterSpacing: "-0.01em" }}>
          All Writing
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text2)", margin: 0 }}>
          Every post, unfiltered — or narrow by type below.
        </p>
      </header>

      {initialLoadDone && blogTypes.length > 1 && (
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} types={blogTypes} />
      )}

      <NotesGrid
        notes={displayed}
        isFetching={isFetching}
        hasMore={hasMore}
        initialLoadDone={initialLoadDone}
        fetchNextBatchOfNotes={fetchNextBatchOfNotes}
      />
    </div>
  );
};

export default BlogSpace;
