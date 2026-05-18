import React, { useContext, useState, useRef, useEffect } from "react";
import NoteContext from "../../../context/Notes/NoteContext";
import FeaturedPosts from "../FeaturedPosts/FeaturedPosts";
import NotesGrid from "../NotesGrid/NotesGrid";
import Sidebar from "../Sidebar/Sidebar";
import Tabs from "../Tabs/Tabs";

const HomeScreen = () => {
  const {
    allNotes,
    fetchNextBatchOfNotes,
    hasMore,
    isFetching,
    initialLoadDone,
    blogTypes,
    recentPosts,
  } = useContext(NoteContext);

  const [activeTab, setActiveTab] = useState("All");
  const tabAnchorRef = useRef(null);
  const isInitialRef = useRef(true);

  const displayed =
    activeTab === "All"
      ? allNotes
      : allNotes.filter((n) => n.type?.toLowerCase() === activeTab.toLowerCase());

  useEffect(() => {
    if (isInitialRef.current) { isInitialRef.current = false; return; }
    tabAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeTab]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      {/* Page header */}
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 400, color: "var(--text)", margin: 0, letterSpacing: "-0.01em" }}>
          Reading
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text2)", marginTop: "0.375rem", marginBottom: 0 }}>
          Essays, notes, and ideas on software, technology, and building things well.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="lg:grid-cols-[1fr_224px]">

        <main style={{ minWidth: 0 }}>
          <FeaturedPosts />

          <div ref={tabAnchorRef} style={{ scrollMarginTop: "4rem" }}>
            {initialLoadDone && blogTypes.length > 1 && (
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} types={blogTypes} />
            )}
          </div>

          <NotesGrid
            notes={displayed}
            isFetching={isFetching}
            hasMore={hasMore}
            initialLoadDone={initialLoadDone}
            fetchNextBatchOfNotes={fetchNextBatchOfNotes}
          />
        </main>

        {initialLoadDone && (
          <div className="hidden lg:block" style={{ position: "sticky", top: "4.5rem", alignSelf: "start" }}>
            <Sidebar recentPosts={recentPosts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
