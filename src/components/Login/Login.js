// src/components/Login/Login.js
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin
import { jwtDecode } from "jwt-decode"; // Import jwt-decode if needed on frontend (often backend handles this)

const Login = () => {
  // Bring in the new googleLogin function from context
  const { login, isUserLoading, googleLogin } = useContext(UserContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For email/pass login
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // For Google login
  const [infoMessage, setInfoMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from?.pathname === "/my-notes") {
      setInfoMessage("Please log in to manage your notes.");
    } else if (location.state?.from) {
      setInfoMessage(
        `Please log in to access ${location.state.from.pathname}.`,
      );
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await login(credentials.email, credentials.password);
      if (result.success) {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Invalid email or password.");
      }
    } catch (error) {
      setError(
        error.message || "An unexpected error occurred. Please try again.",
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // --- Google Login Handlers ---
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    setError("");
    setIsGoogleLoading(true);
    try {
      // The credentialResponse contains the JWT ID token
      const idToken = credentialResponse.credential;

      // Optional: Decode JWT on frontend for quick checks (e.g., display name)
      // const decoded = jwtDecode(idToken);
      // console.log("Decoded JWT:", decoded);

      // Send the token to your backend for verification and login/signup
      const result = await googleLogin(idToken);

      if (result.success) {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Google Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Google login processing error:", err);
      setError("An error occurred during Google login. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
    setError(
      "Google Login failed. Please ensure popups are enabled or try again later.",
    );
    setIsGoogleLoading(false);
  };
  // --- End Google Login Handlers ---

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-96px)]">
      <div className="w-full max-w-md p-10 md:p-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 border-t-4 border-indigo-500">
        <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Login to Your Account
        </h2>
        {infoMessage && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded text-center text-sm">
            {infoMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded text-sm">
            {error}
          </div>
        )}

        {/* --- Google Login Button --- */}
        <div className="mb-6 flex justify-center">
          {isGoogleLoading ? (
            <LoadingSpinner />
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              // You can customize the button appearance here if needed
              // theme="outline"
              // size="large"
              // shape="pill"
              width="300px" // Adjust width as needed
            />
          )}
        </div>
        {/* --- End Google Login Button --- */}

        {/* Divider */}
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-xs">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={isLoading || isUserLoading || isGoogleLoading} // Disable during any loading
            />
          </div>
          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={isLoading || isUserLoading || isGoogleLoading} // Disable during any loading
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
            disabled={isLoading || isUserLoading || isGoogleLoading} // Disable during any loading
          >
            {isLoading ? ( // Only show spinner for email/pass submit
              <LoadingSpinner />
            ) : (
              "Login with Email" // Updated text
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
