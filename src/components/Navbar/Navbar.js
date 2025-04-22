// FILE: src/components/Navbar/Navbar.js
import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import { ThemeContext } from "../../context/ThemeProvider/ThemeProvider";
import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaSearch,
  FaPlus, // Keep if used
  FaSignOutAlt,
  FaUser,
  FaCog, // Icon for Admin Panel
} from "react-icons/fa"; // Using react-icons

const Navbar = () => {
  const { currentUser, isUserLoading, logout } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setShowUserMenu(false); // Close user menu on logout
    navigate("/login"); // Redirect to login after logout
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
      setIsMobileSearchOpen(false); // Close mobile search on submit
      setIsMobileMenuOpen(false); // Close mobile menu on submit
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSearchOpen(false); // Close search if opening menu
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    setIsMobileMenuOpen(false); // Close menu if opening search
  };

  // Handle "Read" link click to scroll or navigate
  const handleReadClick = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    closeMobileMenu(); // Close mobile menu if open
    const targetId = "featured-posts-section"; // The ID of the section to scroll to

    // If already on the HomeScreen, scroll smoothly
    if (location.pathname === "/homescreen") {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Fallback if the element isn't found immediately (rare)
        console.warn(`Scroll target #${targetId} not found on current page.`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // If on a different page, navigate to HomeScreen with the hash
      navigate(`/homescreen#${targetId}`);
      // The useEffect in HomeScreen should handle the scroll after navigation
    }
  };

  // --- Tailwind classes for styling ---
  const linkBase =
    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  const linkActive = "border-indigo-500 text-gray-900 dark:text-gray-100";
  const linkInactive =
    "border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100";
  const mobileLinkBase =
    "block rounded-md px-3 py-2 text-base font-medium text-center"; // Centered mobile links
  const mobileLinkInactive =
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white";
  const mobileLinkActive =
    "bg-indigo-50 dark:bg-gray-900 text-indigo-700 dark:text-white";
  const searchInputClasses =
    "px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const iconButtonClasses =
    "p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const userMenuItemClass =
    "flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600";

  // --- MODIFICATION START ---
  // Check if user is admin or SuperAdmin for conditional rendering
  const isAdminOrSuperAdmin = React.useMemo(() => {
    const allowedRoles = ["admin", "SuperAdmin"];
    return allowedRoles.includes(currentUser?.role);
  }, [currentUser?.role]);
  // --- MODIFICATION END ---

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Nav Links */}
          <div className="flex">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center"
              onClick={closeMobileMenu}
            >
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                √2
              </span>
            </Link>
            {/* Desktop Nav */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a // Use anchor tag for scrolling, handled by handleReadClick
                href="/#featured-posts-section"
                onClick={handleReadClick}
                className={`${linkBase} ${linkInactive} cursor-pointer`}
              >
                Read
              </a>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Categories
              </NavLink>
              {/* Conditionally render My Notes */}
              {/* {currentUser && ( */}
              <NavLink
                to="/my-notes"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                My Notes
              </NavLink>
              {/* )} */}
            </div>
          </div>

          {/* Right Side: Search, Theme, User/Auth */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex items-center relative"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${searchInputClasses} pr-8`}
                aria-label="Search posts"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-r-md"
                aria-label="Submit search"
              >
                <FaSearch />
              </button>
            </form>

            {/* Mobile Search Toggle/Input */}
            <div className="sm:hidden flex items-center">
              {isMobileSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center relative"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${searchInputClasses} w-36 pr-8`} // Adjust width as needed
                    aria-label="Search posts"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 bottom-0 px-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-r-md"
                    aria-label="Submit search"
                  >
                    <FaSearch />
                  </button>
                </form>
              ) : (
                <button
                  onClick={toggleMobileSearch}
                  className={iconButtonClasses}
                  aria-label="Open search"
                >
                  <FaSearch size={20} />
                </button>
              )}
              {/* Close Mobile Search Button */}
              {isMobileSearchOpen && (
                <button
                  onClick={() => {
                    setIsMobileSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className={`${iconButtonClasses} ml-1`}
                  aria-label="Close search"
                >
                  <FaTimes size={20} />
                </button>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={iconButtonClasses}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>

            {/* User Menu / Auth Links (Desktop) */}
            <div className="hidden sm:flex sm:items-center">
              {/* Show loading indicator or user menu/auth links */}
              {/* {isUserLoading ? (
                <div className="p-2"><LoadingSpinner size="sm"/></div> // Or some placeholder
              ) : */}
              {
                !isUserLoading && currentUser ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                      id="user-menu-button"
                      aria-expanded={showUserMenu}
                      aria-haspopup="true"
                    >
                      {currentUser.profilePictureUrl ? (
                        <img
                          src={currentUser.profilePictureUrl}
                          alt="User avatar"
                          className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-300 dark:border-gray-600"
                        />
                      ) : (
                        <span className="mr-2 text-xl">👤</span> // Placeholder avatar
                      )}
                      <span className="hidden md:inline">
                        {currentUser.name}
                      </span>{" "}
                      {/* Hide name on smaller screens if needed */}
                      <svg
                        className="ml-1 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                        tabIndex="-1"
                        onMouseLeave={() => setShowUserMenu(false)} // Close on mouse leave
                      >
                        {/* Add Note */}
                        <Link
                          to="/add-note"
                          onClick={() => setShowUserMenu(false)}
                          className={userMenuItemClass}
                          role="menuitem"
                          tabIndex="-1"
                        >
                          <FaPlus size={14} /> Add New Note
                        </Link>
                        {/* Profile Link */}
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className={userMenuItemClass}
                          role="menuitem"
                          tabIndex="-1"
                        >
                          <FaUser size={14} /> Profile
                        </Link>
                        {/* --- MODIFICATION START --- */}
                        {/* Admin Panel Link (Admin/SuperAdmin Only) */}
                        {isAdminOrSuperAdmin && (
                          <Link
                            to="/admin/categories"
                            onClick={() => setShowUserMenu(false)}
                            className={userMenuItemClass}
                            role="menuitem"
                            tabIndex="-1"
                          >
                            <FaCog size={14} /> Admin Panel
                          </Link>
                        )}
                        {/* --- MODIFICATION END --- */}
                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className={`${userMenuItemClass} w-full`} // Make button full width
                          role="menuitem"
                          tabIndex="-1"
                        >
                          <FaSignOutAlt size={14} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : !isUserLoading ? ( // Only show Login/Signup if not loading and no user
                  <>
                    <Link
                      to="/login"
                      className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 inline-flex items-center px-3 py-2 text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : null /* Render nothing while loading user */
              }
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FaTimes className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FaBars className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden border-t border-gray-200 dark:border-gray-600"
          id="mobile-menu"
        >
          {/* Mobile Nav Links */}
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a // Use anchor tag for scrolling, handled by handleReadClick
              href="/#featured-posts-section"
              onClick={handleReadClick} // Use the handler
              className={`${mobileLinkBase} ${mobileLinkInactive} cursor-pointer`}
            >
              Read
            </a>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `${mobileLinkBase} ${
                  isActive ? mobileLinkActive : mobileLinkInactive
                }`
              }
              onClick={closeMobileMenu}
            >
              Categories
            </NavLink>
            {/* {currentUser && ( */}
            <NavLink
              to="/my-notes"
              className={({ isActive }) =>
                `${mobileLinkBase} ${
                  isActive ? mobileLinkActive : mobileLinkInactive
                }`
              }
              onClick={closeMobileMenu}
            >
              My Notes
            </NavLink>
            {/* )} */}
          </div>
          {/* Mobile User/Auth Section */}
          <div className="pt-3 pb-3 border-t border-gray-200 dark:border-gray-700">
            {
              !isUserLoading && currentUser ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center px-5 mb-3">
                    {currentUser.profilePictureUrl ? (
                      <img
                        src={currentUser.profilePictureUrl}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full mr-3 object-cover flex-shrink-0 border border-gray-300 dark:border-gray-600"
                      />
                    ) : (
                      <span className="mr-3 text-2xl">👤</span> // Placeholder
                    )}
                    <div className="text-left">
                      <div className="text-base font-medium text-gray-800 dark:text-white">
                        {currentUser.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  {/* User Actions */}
                  <div className="px-2 space-y-1">
                    {/* Add Note */}
                    <NavLink
                      to="/add-note"
                      className={({ isActive }) =>
                        `${mobileLinkBase} ${
                          isActive ? mobileLinkActive : mobileLinkInactive
                        }`
                      }
                      onClick={closeMobileMenu}
                    >
                      <FaPlus className="inline mr-1 mb-0.5" /> Add New Note
                    </NavLink>
                    {/* Profile Link */}
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `${mobileLinkBase} ${
                          isActive ? mobileLinkActive : mobileLinkInactive
                        }`
                      }
                      onClick={closeMobileMenu}
                    >
                      <FaUser className="inline mr-1 mb-0.5" /> Profile
                    </NavLink>
                    {/* --- MODIFICATION START --- */}
                    {/* Admin Panel Link (Admin/SuperAdmin Only) */}
                    {isAdminOrSuperAdmin && (
                      <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                          `${mobileLinkBase} ${
                            isActive ? mobileLinkActive : mobileLinkInactive
                          }`
                        }
                        onClick={closeMobileMenu}
                      >
                        <FaCog className="inline mr-1 mb-0.5" /> Admin Panel
                      </NavLink>
                    )}
                    {/* --- MODIFICATION END --- */}
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className={`${mobileLinkBase} ${mobileLinkInactive} w-full`} // Full width button
                    >
                      <FaSignOutAlt className="inline mr-1 mb-0.5" /> Logout
                    </button>
                  </div>
                </>
              ) : !isUserLoading ? ( // Only show if not loading and no user
                <div className="px-2 space-y-1">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `${mobileLinkBase} ${
                        isActive ? mobileLinkActive : mobileLinkInactive
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `${mobileLinkBase} ${
                        isActive ? mobileLinkActive : mobileLinkInactive
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </NavLink>
                </div>
              ) : null /* Render nothing while loading */
            }
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
