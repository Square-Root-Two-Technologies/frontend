import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomeScreen from "./features/blog/HomeScreen/HomeScreen";
import LandingPage from "./features/landing/LandingPage/LandingPage";
import BlogSpace from "./features/blog/BlogSpace/BlogSpace";
import SingleBlogPage from "./features/blog/SingleBlogPage/SingleBlogPage";
import Login from "./features/auth/Login/Login";
import Signup from "./features/auth/Signup/Signup";
import ProtectedRoute from "./features/auth/ProtectedRoute/ProtectedRoute";
import MyNotesPage from "./features/blog/MyNotesPage/MyNotesPage";
import NoteState from "./context/Notes/NoteState";
import UserState from "./context/user/UserState";
import ThemeProvider from "./context/ThemeProvider/ThemeProvider";
import AddNote from "./features/blog/AddNote/AddNote";
import EditNote from "./features/blog/EditNote/EditNote";
import UserProfile from "./features/profile/UserProfile/UserProfile";
import EditProfile from "./features/profile/EditProfile/EditProfile";
import SearchResultsPage from "./features/search/SearchResultsPage/SearchResultsPage";
import PhotosPage from "./features/gallery/PhotosPage";
import CategoriesPage from "./features/blog/CategoriesPage/CategoriesPage";
import CategoryPage from "./features/blog/CategoryPage/CategoryPage";

/* Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* useLocation must be called inside <Router>, so we extract the layout */
function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <ScrollToTop />
      {!isLanding && <Navbar />}
      <main style={isLanding ? { flex: 1 } : { flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/blogspace" element={<BlogSpace />} />
          <Route path="/blog/:id" element={<SingleBlogPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "6rem 1.5rem" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", fontWeight: 400, color: "var(--text2)", margin: "0 0 1rem", fontStyle: "italic" }}>404</p>
                <p style={{ fontSize: "0.9375rem", color: "var(--text3)", marginBottom: "2rem" }}>Page not found.</p>
                <a href="/" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.875rem", borderBottom: "1px solid currentColor" }}>← Go home</a>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserState>
        <NoteState>
          <Router>
            <AppLayout />
          </Router>
        </NoteState>
      </UserState>
    </ThemeProvider>
  );
}

export default App;
