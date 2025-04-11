import React from "react";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-6">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <span className="absolute inset-0 flex items-center justify-center text-sm text-primary font-medium">
        Loading
      </span>
    </div>
  </div>
);

export default LoadingSpinner;
