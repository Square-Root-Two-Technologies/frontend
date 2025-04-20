// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import SingleBlogPage from "./components/SingleBlogPage/SingleBlogPage";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import MyNotesPage from "./components/MyNotesPage/MyNotesPage";
import AddNote from "./components/AddNote/AddNote";
import EditNote from "./components/EditNote/EditNote";
import UserProfile from "./components/UserProfile/UserProfile";
import EditProfile from "./components/EditProfile/EditProfile";
import SearchResultsPage from "./components/SearchResultsPage/SearchResultsPage";
import CategoriesListPage from "./components/CategoriesListPage/CategoriesListPage"; // Stays as the unified page
import CategoryPage from "./components/CategoryPage/CategoryPage";
import AdminCategoriesPage from "./components/AdminCategories/AdminCategoriesPage.js";
// import CategoryTreePage from "./components/CategoryTreePage/CategoryTreePage"; // REMOVE THIS IMPORT
import NoteState from "./context/Notes/NoteState";
import UserState from "./context/user/UserState";
import ThemeProvider from "./context/ThemeProvider/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";

function App() {
  return (
    <ThemeProvider>
      <UserState>
        <NoteState>
          <Router>
            <div className="flex flex-col min-h-screen bg-background dark:bg-dark">
              <Navbar />
              <main className="flex-grow w-full pt-16">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/blog/:slug" element={<SingleBlogPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route
                    path="/categories"
                    element={<CategoriesListPage />}
                  />{" "}
                  {/* Unified page */}
                  {/* <Route path="/category-tree" element={<CategoryTreePage />} /> REMOVE THIS ROUTE */}
                  <Route
                    path="/category/:categoryId"
                    element={<CategoryPage />}
                  />
                  {/* Protected Routes */}
                  <Route
                    path="/my-notes"
                    element={
                      <ProtectedRoute>
                        {" "}
                        <MyNotesPage />{" "}
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/add-note"
                    element={
                      <ProtectedRoute>
                        {" "}
                        <AddNote />{" "}
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-note/:id"
                    element={
                      <ProtectedRoute>
                        {" "}
                        <EditNote />{" "}
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        {" "}
                        <UserProfile />{" "}
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-profile"
                    element={
                      <ProtectedRoute>
                        {" "}
                        <EditProfile />{" "}
                      </ProtectedRoute>
                    }
                  />
                  {/* Admin Routes */}
                  <Route
                    path="/admin/categories"
                    element={
                      <AdminRoute>
                        {" "}
                        <AdminCategoriesPage />{" "}
                      </AdminRoute>
                    }
                  />
                  {/* 404 */}
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
              {/* Footer placeholder */}
            </div>
          </Router>
        </NoteState>
      </UserState>
    </ThemeProvider>
  );
}

export default App;
