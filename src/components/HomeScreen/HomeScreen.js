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
    categories, // <-- Use categories from context
    recentPosts,
  } = useContext(NoteContext);

  // State to track the active category ID ("All" is a special case)
  const [activeCategoryId, setActiveCategoryId] = useState("All");

  const scrollTargetRef = useRef(null); // Ref for scrolling to tabs/grid
  const featuredPostsRef = useRef(null); // Ref for featured posts section

  // Scroll to the notes grid when a category tab (other than "All") is clicked
  useEffect(() => {
    if (!scrollTargetRef.current) return;

    // Only scroll if a specific category is selected (not "All")
    if (activeCategoryId !== "All") {
      scrollTargetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start", // Align top of grid with top of viewport
      });
    }
  }, [activeCategoryId]);

  // Filter notes based on the active category ID
  const displayedNotes =
    activeCategoryId === "All"
      ? allNotes // Show all notes if "All" is selected
      : allNotes.filter((note) => note.category?._id === activeCategoryId); // Filter by category ID

  return (
    <div className="w-full">
      {/* Hero Section with Particle Simulation */}
      <section className="flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-96px)] w-full mb-8">
        {/* Particle Simulation */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-full bg-black">
          <ParticleSimulationScene />
        </div>
        {/* Hero Text */}
        <div className="w-full lg:w-1/2 lg:h-full flex flex-col justify-center items-center p-8 lg:p-12 text-center bg-background dark:bg-dark">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Welcome to √2 Technologies
          </h1>
          <p className="text-lg text-neutral dark:text-gray-300 max-w-prose">
            Explore insights on development, Salesforce, and creative tech.
            Scroll down to discover our latest posts.
          </p>
          {/* Scroll Down Indicator */}
          <div className="mt-8 animate-bounce text-secondary dark:text-gray-500">
            <svg /* ... SVG icon ... */
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

      {/* Main Content Area: Featured, Tabs, Grid, Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Column */}
          <main className="lg:col-span-3">
            {/* Featured Posts */}
            <div ref={featuredPostsRef}>
              <FeaturedPosts />
            </div>

            {/* Scroll Target & Tabs */}
            <div ref={scrollTargetRef} className="scroll-mt-16">
              {" "}
              {/* Added scroll-mt for fixed navbar offset */}
              {/* Render Tabs only if initial load is done and there's more than one category (or just "All") */}
              {initialLoadDone && categories.length > 0 && (
                <Tabs
                  activeCategoryId={activeCategoryId} // Pass the active ID
                  setActiveCategoryId={setActiveCategoryId} // Pass the setter
                  categories={categories} // Pass the array of category objects
                />
              )}
            </div>

            {/* Notes Grid */}
            <div>
              <NotesGrid
                notes={displayedNotes} // Pass the filtered notes
                isFetching={isFetching && activeCategoryId === "All"} // Show grid loading only when fetching 'All' notes batch
                hasMore={activeCategoryId === "All" ? hasMore : false} // Only 'All' tab loads more via scroll for now
                initialLoadDone={initialLoadDone}
                fetchNextBatchOfNotes={
                  activeCategoryId === "All" ? fetchNextBatchOfNotes : () => {}
                } // Only fetch more for 'All'
              />
            </div>
          </main>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20 self-start">
            {/* Render Sidebar only after initial data load */}
            {initialLoadDone && (
              <Sidebar recentPosts={recentPosts} categories={categories} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
