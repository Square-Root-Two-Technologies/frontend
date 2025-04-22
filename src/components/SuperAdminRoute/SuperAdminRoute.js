// src/components/SuperAdminRoute/SuperAdminRoute.js
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const SuperAdminRoute = ({ children }) => {
  const { currentUser, isUserLoading } = useContext(UserContext);
  const location = useLocation();

  if (isUserLoading) {
    // Show loading spinner while user data is being fetched
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    // If user is not loaded and not loading, redirect to login
    console.warn("SuperAdminRoute: No user logged in. Redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has the 'SuperAdmin' role
  if (currentUser.role !== "SuperAdmin") {
    // User is logged in but does not have the required role
    console.warn(
      `SuperAdminRoute: Access denied for user ${currentUser.email} (Role: ${currentUser.role}). Redirecting to home.`,
    );
    // Redirect to a suitable page, e.g., home or a specific "access denied" page
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the SuperAdmin role, render the children components
  return children;
};

export default SuperAdminRoute;
