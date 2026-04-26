import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import LandingPage from "./components/LandingPage/LandingPage";
import BlogSpace from "./components/BlogSpace/BlogSpace";
import SingleBlogPage from "./components/SingleBlogPage/SingleBlogPage";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MyNotesPage from "./components/MyNotesPage/MyNotesPage";
import NoteState from "./context/Notes/NoteState";
import UserState from "./context/user/UserState";
import ThemeProvider from "./context/ThemeProvider/ThemeProvider";
import AddNote from "./components/AddNote/AddNote";
import EditNote from "./components/EditNote/EditNote";
import UserProfile from "./components/UserProfile/UserProfile";
import EditProfile from "./components/EditProfile/EditProfile";
import SearchResultsPage from "./components/SearchResultsPage/SearchResultsPage";

/* useLocation must be called inside <Router>, so we extract the layout */
function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      {!isLanding && <Navbar />}
      <main style={isLanding ? { flex: 1 } : { flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/blogspace" element={<BlogSpace />} />
          <Route path="/blog/:id" element={<SingleBlogPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
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
