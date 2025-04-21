// src/components/HomeScreen/HomeScreen.js
import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import NoteContext from "../../context/Notes/NoteContext";
import CategoryContext from "../../context/category/CategoryContext";
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
  } = useContext(NoteContext);
  const { categories } = useContext(CategoryContext);
  const [activeCategoryId, setActiveCategoryId] = useState("All");
  const featuredPostsRef = useRef(null);
  const categoryTabsAndGridRef = useRef(null);
  const navigate = useNavigate(); // Get the navigate function
  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Scroll to category grid when a specific category is selected
    if (categoryTabsAndGridRef.current && activeCategoryId !== "All") {
      categoryTabsAndGridRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Scroll to featured posts if navigated with hash, then remove hash
    if (
      location.hash === "#featured-posts-section" &&
      featuredPostsRef.current
    ) {
      featuredPostsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Replace history entry to remove the hash without adding a new entry
      navigate(location.pathname, { replace: true });
    }
  }, [activeCategoryId, location, navigate]); // Add dependencies

  const displayedNotes =
    activeCategoryId === "All"
      ? allNotes
      : allNotes.filter((note) => note.category?._id === activeCategoryId);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-64px)] w-full mb-8">
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
            Scroll down or click 'Read' to discover our latest posts.
          </p>
          {/* Scroll Down Indicator */}
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
          {/* Main Column */}
          <main className="lg:col-span-3">
            {/* Featured Posts Section */}
            <div
              ref={featuredPostsRef}
              id="featured-posts-section"
              className="scroll-mt-16"
            >
              {" "}
              {/* Added scroll-mt */}
              <FeaturedPosts />
            </div>

            {/* Category Tabs & Notes Grid Container */}
            <div ref={categoryTabsAndGridRef} className="scroll-mt-16">
              {" "}
              {/* Added scroll-mt */}
              {initialLoadDone && categories && categories.length > 0 && (
                <Tabs
                  activeCategoryId={activeCategoryId}
                  setActiveCategoryId={setActiveCategoryId}
                  categories={categories}
                />
              )}
            </div>
            <div>
              <NotesGrid
                notes={displayedNotes}
                isFetching={isFetching && activeCategoryId === "All"} // Only show general loading for "All" tab
                hasMore={activeCategoryId === "All" ? hasMore : false} // Only paginate "All" tab for now
                initialLoadDone={initialLoadDone}
                fetchNextBatchOfNotes={
                  activeCategoryId === "All" ? fetchNextBatchOfNotes : () => {}
                }
              />
            </div>
          </main>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20 self-start h-[calc(100vh-5rem-2rem)] overflow-y-auto scrollbar-thin">
            {" "}
            {/* Adjusted sticky position and added overflow */}
            {initialLoadDone && categories && (
              <Sidebar categories={categories} /> // Pass categories if needed by Sidebar
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
