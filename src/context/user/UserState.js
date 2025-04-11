// FILE: src/context/user/UserState.js
import React, { useState, useCallback, useMemo, useEffect } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
  const host = "http://localhost:5000";
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Fetches user details using the token from localStorage
  const getUserDetails = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      setIsUserLoading(false);
      console.log("getUserDetails: No token found, user cleared."); // Added log
      return;
    }

    console.log("getUserDetails: Token found, fetching user..."); // Added log
    setIsUserLoading(true);
    try {
      const response = await fetch(`${host}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        // Handle specific errors like invalid token
        if (response.status === 401) {
          console.error("getUserDetails: Invalid token or unauthorized.");
          localStorage.removeItem("token"); // Remove invalid token
          setCurrentUser(null);
        } else {
          throw new Error(`Failed to fetch user, status: ${response.status}`);
        }
      } else {
        const userData = await response.json();
        setCurrentUser(userData);
        console.log(
          "getUserDetails: User fetched successfully:",
          userData.email,
        ); // Added log
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token"); // Clean up token on error
      setCurrentUser(null);
    } finally {
      setIsUserLoading(false);
      console.log(
        "getUserDetails: Fetch finished. Loading state:",
        isUserLoading,
      ); // Added log
    }
  }, [host]); // Removed isUserLoading from dependency array as it causes loops

  // Updates user profile information
  const updateUserProfile = useCallback(
    async (updatedData) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      setIsUserLoading(true);
      try {
        const response = await fetch(`${host}/api/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error("Failed to update profile");

        const responseData = await response.json();
        setCurrentUser(responseData.user); // Update state with returned user data
        return responseData; // Return the full response data
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error; // Rethrow error for the component to handle
      } finally {
        setIsUserLoading(false);
      }
    },
    [host],
  );

  // Clears the current user state
  const clearCurrentUser = useCallback(() => {
    setCurrentUser(null);
    setIsUserLoading(false); // Ensure loading is false when cleared
    console.log("clearCurrentUser: User state cleared."); // Added log
  }, []);

  // Login function
  const login = async (email, password) => {
    // No need for setIsUserLoading(true) here, getUserDetails will handle it
    try {
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || "", // Basic validation/defaulting
          password: password || "", // Basic validation/defaulting
        }),
      });
      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        console.log("Login successful, token stored. Fetching user details..."); // Added log
        await getUserDetails(); // *** CORRECTED FUNCTION CALL ***
        return { success: true }; // Return success object
      } else {
        console.error("Login API error:", json.error); // Log API error
        // Throw specific error for component
        throw new Error(json.error || "Login failed");
      }
    } catch (error) {
      // Catch network or other errors
      console.error("Login function error:", error.message);
      // Return specific error for component
      return { success: false, message: error.message || "Login failed" };
    }
    // No finally block needed here as getUserDetails handles loading state
  };

  // Logout function
  const logout = useCallback(() => {
    console.log("logout: Removing token and clearing user."); // Added log
    localStorage.removeItem("token");
    clearCurrentUser();
    // No navigation here, should be handled by the component calling logout
  }, [clearCurrentUser]);

  // Signup function
  const signup = async (
    name,
    email,
    password,
    country,
    city,
    about,
    avatarUrl,
  ) => {
    // No need for setIsUserLoading(true) here, getUserDetails will handle it
    try {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || "", // Basic validation/defaulting
          email: email || "",
          password: password || "",
          country: country || "", // Send empty string if null/undefined
          city: city || "", // Send empty string if null/undefined
          about: about || "about is empty", // Default if not provided
          avatarUrl: avatarUrl || null, // Send null if not provided
        }),
      });
      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        console.log(
          "Signup successful, token stored. Fetching user details...",
        ); // Added log
        await getUserDetails(); // *** CORRECTED FUNCTION CALL ***
        return { success: true }; // Return success object
      } else {
        console.error("Signup API error:", json.error || json.errors); // Log API error
        // Construct a meaningful error message
        let errorMessage = "Signup failed";
        if (json.error) {
          errorMessage = json.error;
        } else if (json.errors && Array.isArray(json.errors)) {
          errorMessage = json.errors.map((err) => err.msg).join(", ");
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Catch network or other errors
      console.error("Signup function error:", error.message);
      // Return specific error for component
      return { success: false, message: error.message || "Signup failed" };
    }
    // No finally block needed here as getUserDetails handles loading state
  };

  // Effect to fetch user on initial load if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("UserState Initial Load: Token exists?", !!token); // Added log
    if (token) {
      getUserDetails();
    } else {
      setIsUserLoading(false); // Ensure loading is false if no token
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const value = useMemo(
    () => ({
      currentUser,
      isUserLoading,
      getUserDetails,
      updateUserProfile,
      clearCurrentUser,
      login,
      logout,
      signup,
    }),
    [
      currentUser,
      isUserLoading,
      getUserDetails,
      updateUserProfile,
      clearCurrentUser,
      login,
      logout,
      signup,
    ],
  );

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export default UserState;
