import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet, // Keep Outlet if needed elsewhere, but not directly used here for BlogLayout
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import HomeScreen from "./components/HomeScreen/HomeScreen";
// SingleBlogPage is removed from imports as it's replaced
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import MyNotesPage from "./components/MyNotesPage/MyNotesPage";
import AddNote from "./components/AddNote/AddNote";
import EditNote from "./components/EditNote/EditNote";
import UserProfile from "./components/UserProfile/UserProfile";
import EditProfile from "./components/EditProfile/EditProfile";
import SearchResultsPage from "./components/SearchResultsPage/SearchResultsPage";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import AdminCategoriesPage from "./components/AdminCategories/AdminCategoriesPage.js";
import CategoriesExplorerPage from "./components/CategoriesExplorerPage/CategoriesExplorerPage";
import CategoriesWelcomeMessage from "./components/CategoriesExplorerPage/CategoriesWelcomeMessage";
import BlogPostDisplay from "./components/CategoriesExplorerPage/BlogPostDisplay"; // Keep for categories explorer

// Import the new layout and content components
import BlogLayout from "./components/BlogLayout/BlogLayout";
import SingleBlogPostContent from "./components/SingleBlogPostContent/SingleBlogPostContent";
import BlogIndexPage from "./components/BlogIndexPage/BlogIndexPage"; // Optional index page

import NoteState from "./context/Notes/NoteState";
import UserState from "./context/user/UserState";
import CategoryState from "./context/category/CategoryState";
import ThemeProvider from "./context/ThemeProvider/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";

function App() {
  return (
    <ThemeProvider>
      <UserState>
        <CategoryState>
          <NoteState>
            <Router>
              <div className="flex flex-col min-h-screen bg-background dark:bg-dark">
                <Navbar />
                <main className="flex-grow w-full pt-16">
                  {" "}
                  {}
                  <Routes>
                    {}
                    <Route path="/" element={<HomeScreen />} />

                    {/* --- Modified Blog Routing --- */}
                    <Route path="/blog" element={<BlogLayout />}>
                      <Route index element={<BlogIndexPage />} />{" "}
                      {/* Optional: Content for just /blog */}
                      <Route path=":slug" element={<SingleBlogPostContent />} />
                    </Route>
                    {/* --- End Modified Blog Routing --- */}

                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/search" element={<SearchResultsPage />} />

                    {}
                    <Route
                      path="/categories"
                      element={<CategoriesExplorerPage />}
                    >
                      {}
                      <Route index element={<CategoriesWelcomeMessage />} />
                      {}
                      <Route path="blog/:slug" element={<BlogPostDisplay />} />
                      {}
                      {}
                    </Route>
                    {}
                    {}
                    {}
                    <Route
                      path="/category/:categoryId"
                      element={<CategoryPage />}
                    />

                    {}
                    <Route
                      path="/my-notes"
                      element={
                        <ProtectedRoute>
                          <MyNotesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/add-note"
                      element={
                        <ProtectedRoute>
                          <AddNote />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/edit-note/:id"
                      element={
                        <ProtectedRoute>
                          <EditNote />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <UserProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/edit-profile"
                      element={
                        <ProtectedRoute>
                          <EditProfile />
                        </ProtectedRoute>
                      }
                    />

                    {}
                    <Route
                      path="/admin/categories"
                      element={
                        <AdminRoute>
                          <AdminCategoriesPage />
                        </AdminRoute>
                      }
                    />

                    {}
                    <Route
                      path="*"
                      element={
                        <div className="container mx-auto px-4 py-12">
                          <div className="p-6 text-center text-xl text-error bg-red-100 dark:bg-red-900/20 rounded-md">
                            404 - Page Not Found
                          </div>
                        </div>
                      }
                    />
                  </Routes>
                </main>
                {}
              </div>
            </Router>
          </NoteState>
        </CategoryState>
      </UserState>
    </ThemeProvider>
  );
}

export default App;
