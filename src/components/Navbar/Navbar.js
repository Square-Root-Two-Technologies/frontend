// src/components/Navbar/Navbar.js

import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../context/user/UserContext";
import { ThemeContext } from "../../context/ThemeProvider/ThemeProvider";
import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaSearch,
  FaSitemap, // Using FaSitemap as an example icon for the tree view
} from "react-icons/fa";

const Navbar = () => {
  const { currentUser, isUserLoading, logout } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSearchOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    setIsMobileMenuOpen(false);
  };

  // Style constants
  const linkBase =
    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  const linkActive = "border-indigo-500 text-gray-900 dark:text-gray-100";
  const linkInactive =
    "border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100";
  const mobileLinkBase =
    "block rounded-md px-3 py-2 text-base font-medium text-center";
  const mobileLinkInactive =
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white";
  const mobileLinkActive =
    "bg-indigo-50 dark:bg-gray-900 text-indigo-700 dark:text-white";
  const searchInputClasses =
    "px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const iconButtonClasses =
    "p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side: Logo & Desktop Links */}
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
            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Read
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Categories
              </NavLink>
              <NavLink
                to="/my-notes"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Write
              </NavLink>
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

            {/* Mobile Search Button/Input */}
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
                    className={`${searchInputClasses} w-36 pr-8`}
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
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={iconButtonClasses}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>

            {/* Desktop User Menu / Login Buttons */}
            <div className="hidden sm:flex sm:items-center">
              {!isUserLoading && currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                    id="user-menu-button"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    {currentUser.name}
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
                  {showUserMenu && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                      onMouseLeave={() => setShowUserMenu(false)} // Close on mouse leave
                    >
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        role="menuitem"
                        tabIndex="-1"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        role="menuitem"
                        tabIndex="-1"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
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
              )}
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

      {/* Mobile menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden border-t border-gray-200 dark:border-gray-600"
          id="mobile-menu"
        >
          {/* Mobile Navigation Links */}
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${mobileLinkBase} ${
                  isActive ? mobileLinkActive : mobileLinkInactive
                }`
              }
              onClick={closeMobileMenu}
            >
              Read
            </NavLink>
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
            {/* --- NEW LINK FOR CATEGORY TREE (Mobile) --- */}
            <NavLink
              to="/category-tree"
              className={({ isActive }) =>
                `${mobileLinkBase} ${
                  isActive ? mobileLinkActive : mobileLinkInactive
                }`
              }
              onClick={closeMobileMenu}
            >
              Browse Topics
            </NavLink>
            <NavLink
              to="/my-notes"
              className={({ isActive }) =>
                `${mobileLinkBase} ${
                  isActive ? mobileLinkActive : mobileLinkInactive
                }`
              }
              onClick={closeMobileMenu}
            >
              Write
            </NavLink>
          </div>
          {/* Mobile User Actions (Profile/Logout or Login/Signup) */}
          <div className="pt-3 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 space-y-1">
              {!isUserLoading && currentUser ? (
                <>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `${mobileLinkBase} ${
                        isActive ? mobileLinkActive : mobileLinkInactive
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    Profile{" "}
                    <span className="font-normal text-xs">
                      ({currentUser.name})
                    </span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className={`${mobileLinkBase} ${mobileLinkInactive} w-full`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
