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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="lg:grid-cols-[1fr_220px]">

        <main>
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
