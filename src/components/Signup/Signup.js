import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"; // Make sure this component exists

const Signup = () => {
  const { signup, isUserLoading } = useContext(UserContext);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    // Removed 'about' as it wasn't used in the original form submission logic provided
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // --- Validation Checks ---
    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    // Basic checks (you might want more robust validation)
    if (!credentials.name || credentials.name.length < 3) {
      setError("Name must be at least 3 characters long.");
      setIsLoading(false);
      return;
    }
    if (!credentials.email) {
      // Basic check, could add regex validation
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
    // --- End Validation ---

    try {
      const result = await signup(
        credentials.name,
        credentials.email,
        credentials.password,
        credentials.country,
        credentials.city,
        // Pass 'about' if you re-add it to the form state and backend
      );
      if (result.success) {
        navigate("/"); // Redirect to home on successful signup
      } else {
        setError(result.message || "Signup failed"); // Display error from context/backend
      }
    } catch (error) {
      // Catch errors thrown by the signup function (e.g., validation errors)
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

  // --- Tailwind Classes for Inputs (Consistent Style) ---
  const inputBaseClasses =
    "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm";
  const labelBaseClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const requiredMarkClasses = "text-error"; // Assumes 'error' color is defined in tailwind.config.js
  // ---

  // Apply container centering and adjust min-height for navbar
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-96px)]">
      {/* Inner card for the form content */}
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Create Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          {/* Adjusted spacing */}
          {/* Name Field */}
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
              disabled={isLoading || isUserLoading}
            />
          </div>
          {/* Email Field */}
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
              disabled={isLoading || isUserLoading}
            />
          </div>
          {/* Country Field */}
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
              disabled={isLoading || isUserLoading}
            />
          </div>
          {/* City Field */}
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
              disabled={isLoading || isUserLoading}
            />
          </div>
          {/* Password Field */}
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
              disabled={isLoading || isUserLoading}
            />
          </div>
          {/* Confirm Password Field */}
          <div>
            {" "}
            {/* Removed mb-6, using space-y-4 on form */}
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
              disabled={isLoading || isUserLoading}
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
            disabled={isLoading || isUserLoading}
          >
            {isLoading || isUserLoading ? (
              <LoadingSpinner /> // Use the component
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {" "}
          {/* Increased margin-top */}
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
