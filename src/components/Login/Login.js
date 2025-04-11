import React, { useState, useContext, useEffect } from "react"; // Import useEffect
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const Login = () => {
  const { login, isUserLoading } = useContext(UserContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState(""); // State for the informational message
  const navigate = useNavigate();
  const location = useLocation(); // Get location object

  // Check location state when component mounts or state changes
  useEffect(() => {
    if (location.state?.from?.pathname === "/my-notes") {
      setInfoMessage("Please log in to manage your notes.");
      // Optional: Clear the state after showing the message once,
      // so it doesn't reappear if the user navigates away and back
      // navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.from) {
      // Generic message for other protected routes if you add more later
      setInfoMessage(
        `Please log in to access ${location.state.from.pathname}.`,
      );
    }
  }, [location.state, location.pathname, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await login(credentials.email, credentials.password);
      if (result.success) {
        // Redirect to intended page or home after login
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Login
        </h2>

        {/* Display informational message */}
        {infoMessage && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded text-center">
            {infoMessage}
          </div>
        )}

        {/* Display error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        {/* Login Form (unchanged) */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your email"
              required
              disabled={isLoading || isUserLoading}
            />
          </div>
          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your password"
              required
              disabled={isLoading || isUserLoading}
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-600"
            disabled={isLoading || isUserLoading}
          >
            {isLoading || isUserLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Signup Link (unchanged) */}
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
