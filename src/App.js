// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import MyNotesPage from "./components/MyNotesPage/MyNotesPage";
import AddNote from "./components/AddNote/AddNote";
import EditNote from "./components/EditNote/EditNote";
import UserProfile from "./components/UserProfile/UserProfile";
import EditProfile from "./components/EditProfile/EditProfile";
import SearchResultsPage from "./components/SearchResultsPage/SearchResultsPage";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import AdminCategoriesPage from "./components/AdminCategories/AdminCategoriesPage";
import CategoriesExplorerPage from "./components/CategoriesExplorerPage/CategoriesExplorerPage";
import CategoriesWelcomeMessage from "./components/CategoriesExplorerPage/CategoriesWelcomeMessage";
import BlogPostDisplay from "./components/CategoriesExplorerPage/BlogPostDisplay";
import BlogLayout from "./components/BlogLayout/BlogLayout";
import SingleBlogPostContent from "./components/SingleBlogPostContent/SingleBlogPostContent";
import BlogIndexPage from "./components/BlogIndexPage/BlogIndexPage";
import LandingPage from "./components/LandingPage/LandingPage";
import SalesforceServicePage from "./components/Services/SalesforceServicePage";
import FrontendServicePage from "./components/Services/FrontendServicePage";
import BackendServicePage from "./components/Services/BackendServicePage";
import SalesforceExperiencePage from "./components/Services/SalesforceExperiencePage";
import ManageOrganisationPage from "./components/ManageOrganisation/ManageOrganisationPage"; // ADDED

import NoteState from "./context/Notes/NoteState";
import UserState from "./context/user/UserState";
import CategoryState from "./context/category/CategoryState";
import ConsultationRequestState from "./context/ConsultationRequest/ConsultationRequestState"; // ADDED
import ThemeProvider from "./context/ThemeProvider/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import SuperAdminRoute from "./components/SuperAdminRoute/SuperAdminRoute"; // ADDED

function App() {
  return (
    <ThemeProvider>
      <UserState>
        <CategoryState>
          <NoteState>
            <ConsultationRequestState>
              <Router>
                <div className="flex flex-col min-h-screen bg-background dark:bg-dark">
                  <Navbar />
                  <main className="flex-grow w-full pt-16">
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/homescreen" element={<HomeScreen />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/search" element={<SearchResultsPage />} />
                      <Route path="/blog" element={<BlogLayout />}>
                        <Route index element={<BlogIndexPage />} />
                        <Route
                          path=":slug"
                          element={<SingleBlogPostContent />}
                        />
                      </Route>
                      <Route
                        path="/categories"
                        element={<CategoriesExplorerPage />}
                      >
                        <Route index element={<CategoriesWelcomeMessage />} />
                        <Route
                          path="blog/:slug"
                          element={<BlogPostDisplay />}
                        />
                      </Route>
                      <Route
                        path="/category/:categoryId"
                        element={<CategoryPage />}
                      />
                      <Route
                        path="/services/salesforce-experience"
                        element={<SalesforceExperiencePage />}
                      />
                      <Route
                        path="/services/salesforce"
                        element={<SalesforceServicePage />}
                      />
                      <Route
                        path="/services/frontend"
                        element={<FrontendServicePage />}
                      />
                      <Route
                        path="/services/backend"
                        element={<BackendServicePage />}
                      />
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
                      <Route
                        path="/admin/categories"
                        element={
                          <AdminRoute>
                            <AdminCategoriesPage />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/manage-organisation"
                        element={
                          <SuperAdminRoute>
                            <ManageOrganisationPage />
                          </SuperAdminRoute>
                        }
                      />
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
                </div>
              </Router>
            </ConsultationRequestState>
          </NoteState>
        </CategoryState>
      </UserState>
    </ThemeProvider>
  );
}

export default App;
