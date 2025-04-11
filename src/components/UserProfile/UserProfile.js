import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const UserProfile = () => {
  const { currentUser, isUserLoading, getUserDetails } =
    useContext(UserContext);

  useEffect(() => {
    if (!currentUser && !isUserLoading) {
      getUserDetails(); // Fetch user details if not already loaded
    }
  }, [currentUser, isUserLoading, getUserDetails]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Unable to load profile. Please try logging in again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Your Profile
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
              {currentUser.name}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
              {currentUser.email}
            </p>
          </div>

          {/* Add more fields like date joined if available in your user data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Joined
            </label>
            <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
              {new Date(currentUser.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/edit-profile"
            className="w-full inline-flex justify-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
