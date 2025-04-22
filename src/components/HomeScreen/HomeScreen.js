// src/components/HomeScreen/HomeScreen.js
import React, { useContext, useState, useEffect } from "react"; // Removed useRef
// import { useNavigate, useLocation } from "react-router-dom"; // Removed if not used elsewhere
import NoteContext from "../../context/Notes/NoteContext";
import CategoryContext from "../../context/category/CategoryContext";
import Sidebar from "../Sidebar/Sidebar";
import Tabs from "../Tabs/Tabs";
import FeaturedPosts from "../FeaturedPosts/FeaturedPosts";
import NotesGrid from "../NotesGrid/NotesGrid";
// import ParticleSimulationScene from "../ParticleSimulationScene/ParticleSimulationScene"; // Removed import

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
  // const navigate = useNavigate(); // Removed if not used
  // const location = useLocation(); // Removed if not used

  // --- MODIFICATION START ---
  // Removed useRefs and useEffect related to scrolling to sections
  // const featuredPostsRef = useRef(null);
  // const categoryTabsAndGridRef = useRef(null);
  // Removed useEffect(() => { ... }, [activeCategoryId, location, navigate]);
  // --- MODIFICATION END ---

  const displayedNotes =
    activeCategoryId === "All"
      ? allNotes
      : allNotes.filter((note) => note.category?._id === activeCategoryId);

  return (
    <div className="w-full">
      {/* --- MODIFICATION START --- */}
      {/* Removed the entire hero section with ParticleSimulationScene and welcome text */}
      {/*
        <section className="flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-64px)] w-full mb-8">
          <div className="w-full lg:w-1/2 h-[60vh] lg:h-full bg-black">
            <ParticleSimulationScene />
          </div>
          <div className="w-full lg:w-1/2 lg:h-full flex flex-col justify-center items-center p-8 lg:p-12 text-center bg-background dark:bg-dark">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Welcome to √2 Technologies
            </h1>
            <p className="text-lg text-neutral dark:text-gray-300 max-w-prose">
              Explore insights on development, Salesforce, and creative tech.
              Scroll down or click 'Read' to discover our latest posts.
            </p>
            <div className="mt-8 animate-bounce text-secondary dark:text-gray-500">
               // SVG Arrow Icon
            </div>
          </div>
        </section>
      */}
      {/* --- MODIFICATION END --- */}

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        {" "}
        {/* Added top padding */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Column */}
          <main className="lg:col-span-3">
            {/* --- MODIFICATION START --- */}
            {/* Removed ref, id and scroll-mt from this div */}
            <div /* Removed id="featured-posts-section" ref={featuredPostsRef} */
            >
              <FeaturedPosts />
            </div>
            {/* --- MODIFICATION END --- */}

            {/* --- MODIFICATION START --- */}
            {/* Removed ref from this div, kept scroll-mt-16 optionally for future direct links */}
            <div
              /* Removed ref={categoryTabsAndGridRef} */ className="scroll-mt-16"
            >
              {/* --- MODIFICATION END --- */}
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
                isFetching={isFetching && activeCategoryId === "All"} // Only show grid loading for 'All' tab fetch
                hasMore={activeCategoryId === "All" ? hasMore : false} // Only allow infinite scroll for 'All' tab
                initialLoadDone={initialLoadDone}
                fetchNextBatchOfNotes={
                  activeCategoryId === "All" ? fetchNextBatchOfNotes : () => {} // Only fetch more for 'All' tab
                }
              />
            </div>
          </main>

          {/* Sidebar Column */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20 self-start h-[calc(100vh-5rem-2rem)] overflow-y-auto scrollbar-thin">
            {/* Sidebar Content */}
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
