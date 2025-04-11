import React from "react";

const LoadingMoreBlogs = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-[300px] justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-2"></div>
      <span className="text-gray-600 dark:text-gray-400">
        Loading more blogs...
      </span>
    </div>
  );
};

export default LoadingMoreBlogs;
