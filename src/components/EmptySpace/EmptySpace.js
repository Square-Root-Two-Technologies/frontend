// Option 1: Remove the image
import React from "react";

const EmptyState = ({ message = "No blog posts found." }) => (
  <div className="card text-center py-12">
    {/* Image removed */}
    <h3 className="text-lg font-semibold text-neutral dark:text-gray-100 mb-4">
      {" "}
      {/* Added margin-bottom */}
      Nothing Here Yet
    </h3>
    <p className="mt-2 text-subtle">{message}</p>
  </div>
);

export default EmptyState;
