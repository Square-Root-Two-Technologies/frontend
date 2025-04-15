// src/components/HomeScreen/HomeScreen.js
import React, { useContext, useState, useRef, useEffect } from "react"; // <-- Import useRef, useEffect
import NoteContext from "../../context/notes/NoteContext";
import Sidebar from "../Sidebar/Sidebar";
import Tabs from "../Tabs/Tabs";
import FeaturedPosts from "../FeaturedPosts/FeaturedPosts";
import NotesGrid from "../NotesGrid/NotesGrid";

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
  const scrollTargetRef = useRef(null); // <-- Renamed Ref
  const isInitialLoadRef = useRef(true);

  const displayedNotes =
    activeTab === "All"
      ? allNotes
      : allNotes.filter(
          (note) => note.type?.toLowerCase() === activeTab.toLowerCase(),
        );

  useEffect(() => {
    // Use the renamed ref: scrollTargetRef
    if (isInitialLoadRef.current || !scrollTargetRef.current) {
      isInitialLoadRef.current = false;
      return;
    }
    // Scroll the new target (Tabs wrapper) into view
    scrollTargetRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [activeTab]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main className="lg:col-span-3">
          <FeaturedPosts />

          {/* ---- NEW WRAPPER for Tabs ---- */}
          {/* This div becomes the scroll target */}
          {/* Adjust scroll-mt value as needed (e.g., 20, 24, 28) */}
          <div ref={scrollTargetRef} className="scroll-mt-24">
            {" "}
            {/* <-- REF & SCROLL MARGIN MOVED HERE */}
            {initialLoadDone && blogTypes.length > 1 && (
              <Tabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                types={blogTypes}
              />
            )}
            {/* If Tabs aren't rendered, this div still exists as the scroll target */}
            {/* Add min-height if needed when Tabs aren't visible: e.g., className="scroll-mt-24 min-h-[1px]" */}
          </div>
          {/* ---- END NEW WRAPPER ---- */}

          {/* NotesGrid wrapper no longer needs ref or scroll margin */}
          <div>
            <NotesGrid
              notes={displayedNotes}
              isFetching={isFetching}
              hasMore={hasMore}
              initialLoadDone={initialLoadDone}
              fetchNextBatchOfNotes={fetchNextBatchOfNotes}
            />
          </div>
        </main>

        {initialLoadDone && (
          // Sidebar container with sticky positioning
          <div className="hidden lg:block lg:col-span-1 sticky top-24 self-start">
            <Sidebar
              types={blogTypes.filter((t) => t !== "All")}
              recentPosts={recentPosts}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
