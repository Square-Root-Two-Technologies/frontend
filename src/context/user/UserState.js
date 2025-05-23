// FILE: src/context/user/UserState.js
import React, { useState, useCallback, useMemo, useEffect } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
  const host = process.env.REACT_APP_BACKEND;
  //const host = "http://localhost:5000";
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  // Fetches user details using the token from localStorage
  const getUserDetails = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      setIsUserLoading(false);
      console.log("getUserDetails: No token found, user cleared."); // Added log
      return null;
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

  const uploadProfilePicture = useCallback(
    async (file) => {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, message: "Authentication required." };
      }
      if (!file) {
        return { success: false, message: "No file provided." };
      }

      setIsUploadingPicture(true); // Set specific loading state

      const formData = new FormData();
      formData.append("profilePic", file); // Key must match backend (upload.single('profilePic'))

      try {
        const response = await fetch(`${host}/api/auth/profile/picture`, {
          method: "PUT",
          headers: {
            "auth-token": token,
            // ** Important: Do NOT set 'Content-Type': 'multipart/form-data' here! **
            // The browser will set it correctly with the boundary.
          },
          body: formData,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.error ||
              `Image upload failed (Status: ${response.status})`,
          );
        }

        if (responseData.success && responseData.user) {
          // Update the currentUser state with the latest user data from backend
          setCurrentUser(responseData.user);
          console.log("Profile picture updated successfully in context");
          return { success: true, user: responseData.user };
        } else {
          // Handle cases where backend might return success: false or no user data
          throw new Error(
            responseData.message ||
              "Image upload did not return expected data.",
          );
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        return {
          success: false,
          message: error.message || "Failed to upload image.",
        };
      } finally {
        setIsUploadingPicture(false); // Reset specific loading state
      }
    },
    [host], // Dependency: host
  );

  // Clears the current user state
  const clearCurrentUser = useCallback(() => {
    setCurrentUser(null);
    setIsUserLoading(false); // Ensure loading is false when cleared
    console.log("clearCurrentUser: User state cleared."); // Added log
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || "",
          password: password || "",
        }),
      });

      // Check if the response status indicates an error (like 4xx or 5xx)
      if (!response.ok) {
        // --- Read the body ONCE as text ---
        const errorText = await response.text(); // Read the body first
        console.error(
          `Login API Error Response (Status: ${response.status}):`,
          errorText,
        );

        let errorMessage = `Login failed (Status: ${response.status})`;
        try {
          // --- Try to PARSE the text we already read ---
          const errorJson = JSON.parse(errorText);
          // Use specific error from JSON if available (e.g., for 400 errors)
          errorMessage =
            errorJson.error ||
            `Login failed: ${errorJson.message || errorText.substring(0, 100)}`;
        } catch (e) {
          // If parsing failed, it was likely plain text (like the 500 error)
          errorMessage = `Server error: ${
            response.status
          } - ${errorText.substring(0, 100)}`;
        }
        // Throw the determined error message
        throw new Error(errorMessage);
      }

      // If response.ok is true, THEN read the body as JSON
      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        console.log("Login successful, token stored. Fetching user details...");
        await getUserDetails(); // Ensure getUserDetails handles its own errors
        return { success: true };
      } else {
        // Handles cases where response is ok (2xx) but backend indicates logical failure
        console.error("Login API error (success=false):", json.error);
        throw new Error(json.error || "Login failed");
      }
    } catch (error) {
      // This catch block handles errors from fetch itself OR the errors thrown from the !response.ok block
      console.error("Login function error:", error.message);
      return { success: false, message: error.message || "Login failed" };
    }
  };

  // --- NEW Google Login Function ---
  const googleLogin = async (idToken) => {
    if (!idToken) {
      return { success: false, message: "Google ID Token is missing." };
    }
    try {
      const response = await fetch(`${host}/api/auth/google-login`, {
        // New backend endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }), // Send the token
      });
      const json = await response.json();
      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        console.log(
          "Google login successful, token stored. Fetching user details...",
        );
        await getUserDetails(); // Fetch user details after storing token
        return { success: true };
      } else {
        console.error("Google Login API error:", json.error);
        // Use the error from the API response
        throw new Error(json.error || "Google login failed on backend");
      }
    } catch (error) {
      console.error("Google login function error:", error.message);
      return {
        success: false,
        message: error.message || "Google login failed",
      };
    }
  };

  // Logout function
  const logout = useCallback(() => {
    console.log("logout: Removing token and clearing user."); // Added log
    localStorage.removeItem("token");
    clearCurrentUser();
    // No navigation here, should be handled by the component calling logout
  }, [clearCurrentUser]);

  // Signup function
  const signup = async (name, email, password, country, city, about) => {
    try {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || "",
          email: email || "",
          password: password || "",
          country: country || "",
          city: city || "",
          about: about || "about is empty",
        }),
      });

      // --- ADD THIS CHECK ---
      if (!response.ok) {
        // Try to get error text if not JSON
        const errorText = await response.text();
        console.error("Signup API Error Response:", errorText);
        // Try to parse as JSON if possible, otherwise use text
        let errorMessage = "Signup failed";
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) {
            errorMessage = errorJson.error;
          } else if (errorJson.errors && Array.isArray(errorJson.errors)) {
            errorMessage = errorJson.errors.map((err) => err.msg).join(", ");
          } else {
            errorMessage = `Server error: ${
              response.status
            } - ${errorText.substring(0, 100)}`; // Show start of text
          }
        } catch (e) {
          errorMessage = `Server error: ${
            response.status
          } - ${errorText.substring(0, 100)}`; // Show start of text if parsing failed
        }
        throw new Error(errorMessage);
      }
      // --- END ADDED CHECK ---

      const json = await response.json(); // Now only called if response.ok is true

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        console.log(
          "Signup successful, token stored. Fetching user details...",
        );
        await getUserDetails();
        return { success: true };
      } else {
        // This part might be less likely to be reached if !response.ok is handled above
        console.error(
          "Signup API error (but response ok?):",
          json.error || json.errors,
        );
        let errorMessage = "Signup failed";
        if (json.error) {
          errorMessage = json.error;
        } else if (json.errors && Array.isArray(json.errors)) {
          errorMessage = json.errors.map((err) => err.msg).join(", ");
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Signup function error:", error.message);
      return { success: false, message: error.message || "Signup failed" };
    }
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
      isUploadingPicture,
      uploadProfilePicture,
      googleLogin,
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
      isUploadingPicture,
      uploadProfilePicture,
      googleLogin,
    ],
  );

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export default UserState;
