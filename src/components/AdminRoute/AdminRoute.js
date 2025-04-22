// src/components/AdminRoute/AdminRoute.js
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const AdminRoute = ({ children }) => {
  const { currentUser, isUserLoading } = useContext(UserContext);
  const location = useLocation();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const allowedAdminRoles = ["admin", "SuperAdmin"];
  if (!allowedAdminRoles.includes(currentUser.role)) {
    // User is logged in but not an admin or SuperAdmin, redirect to home
    console.warn(
      `AdminRoute: Access denied for non-admin/SuperAdmin user (role: ${currentUser.role}).`,
    );
    return <Navigate to="/" replace />;
  }

  // Logged in and is an admin, render the child components
  return children;
};

export default AdminRoute;
