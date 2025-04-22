import React from "react";

const LoadingSpinner = ({ size = "md" }) => {
  // Default to medium size
  // Define size classes
  const sizes = {
    sm: "h-5 w-5 border-2", // Small size for inline use
    md: "h-12 w-12 border-4", // Medium default size
    lg: "h-16 w-16 border-4", // Large size
  };

  // Define text size classes (optional, hide text for 'sm')
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Adjust padding based on size for better layout
  const paddingClass = size === "sm" ? "py-1 px-1" : "py-6";

  return (
    // Center the spinner, adjust padding based on size
    <div className={`flex justify-center items-center ${paddingClass}`}>
      <div className="relative">
        {/* Apply size-specific border and dimensions */}
        <div
          className={`animate-spin rounded-full border-primary border-t-transparent ${sizes[size]}`}
        ></div>

        {/* Optionally show text only for medium and large spinners */}
        {size !== "sm" && (
          <span
            className={`absolute inset-0 flex items-center justify-center text-primary font-medium ${textSizes[size]}`}
          >
            Loading
          </span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
