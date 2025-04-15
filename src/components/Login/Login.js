import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const Login = () => {
  const { login, isUserLoading } = useContext(UserContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  }, [location.state]); // Removed location.pathname and navigate as dependencies

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
        // Use error message from context/API if available
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

  return (
    // Added more vertical padding (py-12 sm:py-16)
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-12 sm:py-16">
      {/* Increased padding (p-10 md:p-12), added border, increased shadow, added top border */}
      <div className="w-full max-w-md p-10 md:p-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 border-t-4 border-indigo-500">
        <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {" "}
          {/* Increased margin-bottom */}
          Login to Your Account
        </h2>

        {infoMessage && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded text-center text-sm">
            {infoMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded text-sm">
            {" "}
            {/* Adjusted dark bg */}
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          {/* Added space-y-6 */}
          <div>
            {" "}
            {/* Wrapped input in div for spacing */}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" // Added margin-bottom
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm" // Added sm:text-sm
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={isLoading || isUserLoading}
            />
          </div>
          <div>
            {" "}
            {/* Wrapped input in div for spacing */}
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" // Added margin-bottom
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm" // Added sm:text-sm
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={isLoading || isUserLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800" // Adjusted padding, added disabled style
            disabled={isLoading || isUserLoading}
          >
            {isLoading || isUserLoading ? (
              <LoadingSpinner size="sm" /> // Ensure LoadingSpinner takes size prop
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {" "}
          {/* Increased margin-top */}
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
