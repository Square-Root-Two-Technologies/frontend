import React, { useEffect } from "react"; // Import useEffect
import { Outlet, useLocation } from "react-router-dom"; // Import useLocation
import BlogSidebar from "../BlogSidebar/BlogSidebar";

const CategoriesExplorerPage = () => {
  const location = useLocation(); // Get the current location object

  // Add this useEffect hook
  useEffect(() => {
    // Scroll to the top of the window whenever the pathname changes
    window.scrollTo(0, 0);
  }, [location.pathname]); // Dependency array ensures this runs when the route changes

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-heading mb-8 text-center lg:text-left">
        Explore Topics
      </h1>
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 mb-8 lg:mb-0">
          {/* BlogSidebar is rendered here */}
          <BlogSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-grow min-w-0">
          <Outlet />{" "}
          {/* Child routes (like CategoriesWelcomeMessage or BlogPostDisplay) render here */}
        </main>
      </div>
    </div>
  );
};

export default CategoriesExplorerPage;
