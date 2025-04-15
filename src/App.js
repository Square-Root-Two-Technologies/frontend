import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import BlogSpace from "./components/BlogSpace/BlogSpace";
import SingleBlogPage from "./components/SingleBlogPage/SingleBlogPage";
import Login from "./components/Login/Login";
import signup from "./components/Signup/Signup";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MyNotesPage from "./components/MyNotesPage/MyNotesPage";
import NoteState from "./context/notes/NoteState";
import UserState from "./context/user/UserState"; // Correct import path
import ThemeProvider from "./context/ThemeProvider/ThemeProvider";
import AddNote from "./components/AddNote/AddNote";
import EditNote from "./components/EditNote/EditNote";
import UserProfile from "./components/UserProfile/UserProfile";
import EditProfile from "./components/EditProfile/EditProfile";

function App() {
  return (
    <ThemeProvider>
      <UserState>
        <NoteState>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/blogspace" element={<BlogSpace />} />
                  <Route path="/blog/:id" element={<SingleBlogPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<signup />} />
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
                      <div className="p-6 text-center text-xl text-error">
                        404 - Page Not Found
                      </div>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </NoteState>
      </UserState>
    </ThemeProvider>
  );
}

export default App;
