import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const BlogIndexPage = () => {
  return (
    <div className="card h-full flex flex-col items-center justify-center text-center min-h-[50vh]">
      <FaArrowLeft className="text-4xl text-primary mb-4" />
      <h2 className="text-xl md:text-2xl font-semibold text-neutral dark:text-gray-100 mb-3">
        Select a Post
      </h2>
      <p className="text-subtle max-w-md">
        Choose a blog post from the sidebar on the left to read it here.
      </p>
    </div>
  );
};

export default BlogIndexPage;
