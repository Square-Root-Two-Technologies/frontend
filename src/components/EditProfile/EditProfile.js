import React, { useState, useContext, useEffect, useRef } from "react"; // Import useRef
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { FaUserCircle, FaCamera } from "react-icons/fa";

const EditProfile = () => {
  const {
    currentUser,
    isUserLoading,
    updateUserProfile,
    getUserDetails, // Make sure getUserDetails is provided by context if needed
    isUploadingPicture,
    uploadProfilePicture, // Function to upload the picture
  } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    city: "",
    about: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmittingText, setIsSubmittingText] = useState(false); // Separate loading for text fields
  const fileInputRef = useRef(null); // Ref for file input

  const navigate = useNavigate();

  // Populate form with current user data
  useEffect(() => {
    // Optional: Re-fetch user details if not present or needed
    // if (!currentUser && !isUserLoading) {
    //   getUserDetails();
    // }

    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        country: currentUser.country || "",
        city: currentUser.city || "",
        about: currentUser.about || "",
      });
      setPreviewUrl(currentUser.profilePictureUrl); // Set initial preview
    }
  }, [currentUser /*, isUserLoading, getUserDetails */]); // Adjust dependencies if getUserDetails is used

  // Create preview URL when a file is selected
  useEffect(() => {
    if (!selectedFile) {
      // If file is cleared, revert preview to original URL or null
      // setPreviewUrl(currentUser?.profilePictureUrl || null); // Re-enable if you want preview to revert on cancel
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Free memory when the component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile /*, currentUser?.profilePictureUrl */]); // Add currentUser dependency if revert logic is used

  // Handle text input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation (Type and Size)
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (JPEG, PNG, GIF, WebP).");
        setSelectedFile(null);
        setPreviewUrl(currentUser?.profilePictureUrl || null); // Revert preview
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit (matches backend)
        setError("Image file size should not exceed 5MB.");
        setSelectedFile(null);
        setPreviewUrl(currentUser?.profilePictureUrl || null); // Revert preview
        return;
      }

      setError(""); // Clear previous errors
      setSelectedFile(file);
    }
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle profile text field updates
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingText(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateUserProfile({
        name: formData.name,
        // email: formData.email, // Usually email shouldn't be editable easily
        country: formData.country,
        city: formData.city,
        about: formData.about,
      });

      // Assuming updateUserProfile returns the updated user or success status
      if (result) {
        setSuccess("Profile details updated successfully!");
        // Optionally navigate away after a delay
        // setTimeout(() => navigate("/profile"), 1500);
      } else {
        setError("Failed to update profile details."); // Or use error from result if available
      }
    } catch (error) {
      setError(error.message || "Failed to update profile details");
    } finally {
      setIsSubmittingText(false);
    }
  };

  // Handle picture upload
  const handlePictureUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }
    setError("");
    setSuccess("");

    try {
      const result = await uploadProfilePicture(selectedFile);
      if (result && result.success) {
        setSuccess("Profile picture updated successfully!");
        setSelectedFile(null); // Clear selected file after successful upload
        // No need to setPreviewUrl here, useEffect on currentUser will update it
      } else {
        setError(result?.message || "Failed to upload profile picture.");
      }
    } catch (error) {
      // This catch might not be needed if uploadProfilePicture handles errors internally
      setError(error.message || "An error occurred during upload.");
    }
    // Loading state is handled by `isUploadingPicture` from context
  };

  // --- Loading and Error States ---
  if (isUserLoading && !currentUser) {
    // Show loading only on initial load when no user data is present yet
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    // Handle case where loading finished but user is still null (e.g., auth error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Unable to load profile. Please try logging in again.
        </p>
      </div>
    );
  }

  const inputClasses =
    "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const buttonClasses =
    "w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-150 ease-in-out";
  const uploadButtonClasses =
    "py-2 px-4 mt-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-150 ease-in-out";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Edit Profile
        </h2>

        {/* --- Status Messages --- */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded text-sm text-center">
            {success}
          </div>
        )}

        {/* --- Profile Picture Section --- */}
        <div className="flex flex-col items-center space-y-4">
          <div
            className="relative group cursor-pointer"
            onClick={handleAvatarClick}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 group-hover:opacity-75 transition-opacity"
              />
            ) : (
              <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-gray-500 group-hover:opacity-75 transition-opacity" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <FaCamera className="text-white text-3xl" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/png, image/jpeg, image/gif, image/webp" // Specify acceptable image types
            className="hidden" // Hide the default input
            disabled={isUploadingPicture}
          />
          {selectedFile && (
            <button
              onClick={handlePictureUpload}
              className={`${uploadButtonClasses} flex items-center justify-center gap-2`}
              disabled={isUploadingPicture}
            >
              {isUploadingPicture ? (
                <>
                  <LoadingSpinner size="sm" /> Uploading...
                </>
              ) : (
                "Upload Picture"
              )}
            </button>
          )}
          {!selectedFile && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click image to change (Max 5MB)
            </p>
          )}
        </div>

        {/* --- Text Fields Form --- */}
        <form onSubmit={handleTextSubmit} className="mt-8 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClasses}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              className={inputClasses}
              placeholder="Your Name"
              required
              minLength="3"
              disabled={isSubmittingText}
            />
          </div>

          {/* Email (Display Only) */}
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email (cannot be changed)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className={`${inputClasses} bg-gray-100 dark:bg-gray-700/50`} // Indicate disabled state visually
              readOnly // Make it non-editable
              disabled // Ensure it's truly disabled
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className={labelClasses}>
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={onChange}
              className={inputClasses}
              placeholder="Your Country"
              minLength="2"
              disabled={isSubmittingText}
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className={labelClasses}>
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={onChange}
              className={inputClasses}
              placeholder="Your City"
              minLength="1"
              disabled={isSubmittingText}
            />
          </div>

          {/* About */}
          <div>
            <label htmlFor="about" className={labelClasses}>
              About You
            </label>
            <textarea
              id="about"
              name="about"
              rows="3"
              value={formData.about}
              onChange={onChange}
              className={inputClasses}
              placeholder="Tell us a little about yourself"
              disabled={isSubmittingText}
            ></textarea>
          </div>

          {/* Submit Button for Text Fields */}
          <button
            type="submit"
            className={`${buttonClasses} flex items-center justify-center gap-2`}
            disabled={isSubmittingText}
          >
            {isSubmittingText ? (
              <>
                <LoadingSpinner size="sm" /> Saving...
              </>
            ) : (
              "Save Profile Details"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple inline spinner for buttons
const ButtonSpinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default EditProfile;
