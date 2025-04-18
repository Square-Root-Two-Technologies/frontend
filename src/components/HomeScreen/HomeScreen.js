import React, { useContext, useState, useRef, useEffect } from "react";
import NoteContext from "../../context/Notes/NoteContext";
import Sidebar from "../Sidebar/Sidebar";
import Tabs from "../Tabs/Tabs";
import FeaturedPosts from "../FeaturedPosts/FeaturedPosts";
import NotesGrid from "../NotesGrid/NotesGrid";
import ParticleSimulationScene from "../ParticleSimulationScene/ParticleSimulationScene";

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
  const scrollTargetRef = useRef(null);
  const featuredPostsRef = useRef(null);

  useEffect(() => {
    if (!scrollTargetRef.current) return;
    if (activeTab !== "All") {
      scrollTargetRef.current.scrollIntoView({
        behavior: "smooth",
        // Make sure block aligns correctly below the now fixed Navbar
        block: "start",
      });
    }
  }, [activeTab]);

  const displayedNotes =
    activeTab === "All"
      ? allNotes
      : allNotes.filter(
          (note) => note.type?.toLowerCase() === activeTab.toLowerCase(),
        );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-96px)] w-full mb-8">
        {/* Particle Simulation */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-full bg-black">
          <ParticleSimulationScene />
        </div>
        {/* Welcome Text */}
        <div className="w-full lg:w-1/2 lg:h-full flex flex-col justify-center items-center p-8 lg:p-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Welcome to √2 Technologies
          </h1>
          <p className="text-lg text-neutral dark:text-gray-300 max-w-prose">
            Explore insights on development, Salesforce, and creative tech.
            Scroll down to discover our latest posts.
          </p>
          <div className="mt-8 animate-bounce text-secondary dark:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Blog Posts Area */}
          <main className="lg:col-span-3">
            <div ref={featuredPostsRef}>
              <FeaturedPosts />
            </div>
            {/* Scroll target for Tabs - ensure scroll-mt matches navbar height */}
            <div ref={scrollTargetRef} className="scroll-mt-16">
              {" "}
              {/* Adjusted scroll-mt-16 for h-16 navbar */}
              {initialLoadDone && blogTypes.length > 1 && (
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  types={blogTypes}
                />
              )}
            </div>
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

          {/* Sidebar Area - Stays sticky relative to its container */}
          {/* Adjust top-X if needed */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20 self-start">
            {" "}
            {/* e.g., top-20 (80px) if navbar is h-16 (64px) */}
            {initialLoadDone && <Sidebar recentPosts={recentPosts} />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeScreen;
