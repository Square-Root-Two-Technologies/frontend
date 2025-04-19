import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { FaUserCircle } from "react-icons/fa"; // Removed FaCamera, not needed here

const UserProfile = () => {
  const {
    currentUser,
    isUserLoading,
    getUserDetails,
    // No need for upload functions here
  } = useContext(UserContext);

  // Fetch user details if not already available (e.g., on direct navigation)
  useEffect(() => {
    if (!currentUser && !isUserLoading) {
      getUserDetails();
    }
  }, [currentUser, isUserLoading, getUserDetails]);

  // --- Loading State ---
  if (isUserLoading || (!currentUser && isUserLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // --- Error/Not Found State ---
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Unable to load profile. Please try logging in again.
        </p>
      </div>
    );
  }

  // Default Avatar Component
  const DefaultAvatar = () => (
    <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-gray-500" /> // Increased size
  );

  // --- Profile Display ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
        {" "}
        {/* Added text-center */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Your Profile
        </h2>
        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          {" "}
          {/* Increased bottom margin */}
          {currentUser.profilePictureUrl ? (
            <img
              src={currentUser.profilePictureUrl}
              alt={`${currentUser.name}'s profile`}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 shadow-md" // Increased size, added border/shadow
            />
          ) : (
            <DefaultAvatar />
          )}
        </div>
        {/* Profile Details */}
        <div className="space-y-5 text-left">
          {" "}
          {/* Increased spacing, keep text left */}
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Name
            </label>
            <p className="mt-1 text-xl text-gray-900 dark:text-gray-100">
              {" "}
              {/* Increased text size */}
              {currentUser.name || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </label>
            <p className="mt-1 text-xl text-gray-900 dark:text-gray-100">
              {" "}
              {/* Increased text size */}
              {currentUser.email || "N/A"}
            </p>
          </div>
          {/* Display Country and City if they exist */}
          {currentUser.country && (
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Country
              </label>
              <p className="mt-1 text-xl text-gray-900 dark:text-gray-100">
                {currentUser.country}
              </p>
            </div>
          )}
          {currentUser.city && (
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                City
              </label>
              <p className="mt-1 text-xl text-gray-900 dark:text-gray-100">
                {currentUser.city}
              </p>
            </div>
          )}
          {/* Display About if it exists */}
          {currentUser.about && currentUser.about !== "about is empty" && (
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                About
              </label>
              <p className="mt-1 text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {" "}
                {/* Allow line breaks */}
                {currentUser.about}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Joined
            </label>
            <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
              {" "}
              {/* Slightly smaller text */}
              {new Date(currentUser.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        {/* Edit Button */}
        <div className="mt-8">
          {" "}
          {/* Increased top margin */}
          <Link
            to="/edit-profile"
            className="w-full inline-flex justify-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
