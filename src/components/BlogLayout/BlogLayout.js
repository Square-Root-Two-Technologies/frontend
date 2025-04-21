import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import BlogSidebar from "../BlogSidebar/BlogSidebar"; // Adjust path if needed
import NoteContext from "../../context/Notes/NoteContext"; // Import NoteContext

const BlogLayout = () => {
  // Get the currently viewed single note from context
  const { note: currentNote } = useContext(NoteContext);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* You might want a main heading here or Breadcrumbs if applicable */}
      {/* <h1 className="text-heading mb-8">Blog</h1> */}

      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* BlogSidebar now uses the currentNote from context */}
        <BlogSidebar currentNote={currentNote} />

        <main className="flex-grow min-w-0">
          {/* The specific blog post content will render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BlogLayout;
