// src/components/Signup/Signup.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin

const Signup = () => {
  // Get googleLogin function from context
  const { signup, isUserLoading, googleLogin } = useContext(UserContext);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    // Removed 'about' as it's optional and defaulted on backend
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For email/pass signup
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // For Google signup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Use specific loader for email/pass
    setError("");

    // --- Frontend Validation ---
    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (!credentials.name || credentials.name.length < 3) {
      setError("Name must be at least 3 characters long.");
      setIsLoading(false);
      return;
    }
    if (!credentials.email || !/\S+@\S+\.\S+/.test(credentials.email)) {
      setError("Please enter a valid email.");
      setIsLoading(false);
      return;
    }
    if (!credentials.country || credentials.country.length < 2) {
      setError("Country must be at least 2 characters long.");
      setIsLoading(false);
      return;
    }
    if (!credentials.city || credentials.city.length < 1) {
      setError("City is required.");
      setIsLoading(false);
      return;
    }
    if (!credentials.password || credentials.password.length < 5) {
      setError("Password must be at least 5 characters long.");
      setIsLoading(false);
      return;
    }
    // --- End Frontend Validation ---

    try {
      const result = await signup(
        credentials.name,
        credentials.email,
        credentials.password,
        credentials.country,
        credentials.city,
        // 'about' is handled by backend default
      );
      if (result.success) {
        navigate("/"); // Redirect to home after successful signup
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (error) {
      setError(
        error.message || "An unexpected error occurred. Please try again.",
      );
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // --- Google Signup/Login Handlers ---
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Sign-Up/Login Success:", credentialResponse);
    setError("");
    setIsGoogleLoading(true); // Use specific loader
    try {
      const idToken = credentialResponse.credential;
      // Send the token to the backend endpoint which handles both login & signup
      const result = await googleLogin(idToken);

      if (result.success) {
        // Navigate to home regardless of whether it was login or signup
        navigate("/");
      } else {
        setError(result.message || "Google Sign-Up failed. Please try again.");
      }
    } catch (err) {
      console.error("Google sign-up/login processing error:", err);
      setError("An error occurred during Google Sign-Up. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-Up/Login Failed");
    setError(
      "Google Sign-Up failed. Please ensure popups are enabled or try again later.",
    );
    setIsGoogleLoading(false);
  };
  // --- End Google Handlers ---

  const inputBaseClasses =
    "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:opacity-50 disabled:bg-gray-200 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"; // Added disabled styles
  const labelBaseClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const requiredMarkClasses = "text-error";

  // Disable form fields if any loading is happening
  const isFormDisabled = isLoading || isUserLoading || isGoogleLoading;

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-96px)]">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Create Your Account
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded text-sm">
            {error}
          </div>
        )}

        {/* --- Google Sign-Up Button --- */}
        <div className="mb-6 flex justify-center">
          {isGoogleLoading ? (
            <LoadingSpinner />
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              // You might want slightly different text/theme here?
              // theme="filled_blue" // Example theme
              // text="signup_with" // Example text option
              useOneTap={false} // Disable One Tap on signup page to avoid confusion
              width="300px" // Adjust width as needed
            />
          )}
        </div>
        {/* --- End Google Sign-Up Button --- */}

        {/* Divider */}
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-xs">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelBaseClasses}>
              Name <span className={requiredMarkClasses}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={credentials.name}
              onChange={onChange}
              className={inputBaseClasses}
              placeholder="Enter your name"
              required
              minLength="3"
              disabled={isFormDisabled} // Disable if loading
            />
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className={labelBaseClasses}>
              Email <span className={requiredMarkClasses}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className={inputBaseClasses}
              placeholder="Enter your email"
              required
              disabled={isFormDisabled} // Disable if loading
            />
          </div>
          {/* Country */}
          <div>
            <label htmlFor="country" className={labelBaseClasses}>
              Country <span className={requiredMarkClasses}>*</span>
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={credentials.country}
              onChange={onChange}
              className={inputBaseClasses}
              placeholder="Enter your country"
              required
              minLength="2"
              disabled={isFormDisabled} // Disable if loading
            />
          </div>
          {/* City */}
          <div>
            <label htmlFor="city" className={labelBaseClasses}>
              City <span className={requiredMarkClasses}>*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={credentials.city}
              onChange={onChange}
              className={inputBaseClasses}
              placeholder="Enter your city"
              required
              minLength="1"
              disabled={isFormDisabled} // Disable if loading
            />
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className={labelBaseClasses}>
              Password <span className={requiredMarkClasses}>*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              className={inputBaseClasses}
              placeholder="Enter your password (min 5 chars)"
              required
              minLength="5"
              disabled={isFormDisabled} // Disable if loading
            />
          </div>
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className={labelBaseClasses}>
              Confirm Password <span className={requiredMarkClasses}>*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={onChange}
              className={inputBaseClasses}
              placeholder="Confirm your password"
              required
              minLength="5"
              disabled={isFormDisabled} // Disable if loading
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
            disabled={isFormDisabled} // Disable if loading
          >
            {isLoading ? ( // Show spinner only for email/pass submit
              <LoadingSpinner />
            ) : (
              "Sign Up with Email" // Updated text
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
