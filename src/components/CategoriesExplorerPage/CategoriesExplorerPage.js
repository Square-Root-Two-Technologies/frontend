import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BlogSidebar from "../BlogSidebar/BlogSidebar";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const CategoriesExplorerPage = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile && location.pathname.includes("/categories/blog/")) {
      setIsSidebarOpen(false);
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Mobile toggle button classes (positioning adjusted slightly if needed)
  const mobileToggleClasses = `
    absolute top-4 z-40 p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-md
    transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500
    lg:hidden
    ${isSidebarOpen ? "translate-x-60" : "translate-x-4"}
  `;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-var(--navbar-height,4rem))]">
      <h1 className="text-heading mb-8 text-center lg:text-left">
        Explore Topics
      </h1>

      <div className="relative h-[calc(100vh-var(--navbar-height,4rem)-100px)] lg:h-auto overflow-hidden lg:overflow-visible lg:flex lg:gap-8">
        {/* --- MOBILE-ONLY Toggle Button --- */}
        <button
          onClick={toggleSidebar}
          className={mobileToggleClasses}
          aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarOpen ? (
            <FaAngleLeft size={16} />
          ) : (
            <FaAngleRight size={16} />
          )}
        </button>

        {/* Sidebar Wrapper Div */}
        <div
          className={`
            absolute inset-y-0 left-0 z-30 w-64
            bg-gray-50 dark:bg-gray-800
            shadow-lg lg:shadow-none
            transition-transform duration-300 ease-in-out
            lg:relative lg:inset-auto lg:left-auto lg:z-auto lg:w-auto lg:transform-none lg:flex-shrink-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <BlogSidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Main Content Area */}
        <main
          className={`
            h-full overflow-y-auto
            transition-transform duration-300 ease-in-out lg:transition-none
            lg:transform-none lg:flex-grow lg:min-w-0
            w-full
            ${isSidebarOpen ? "lg:ml-0" : "lg:ml-0"}
            ${
              isSidebarOpen
                ? "translate-x-64 lg:translate-x-0"
                : "translate-x-0"
            }
            pt-16 lg:pt-0 /* Increased mobile padding-top to push content below the button */
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CategoriesExplorerPage;
