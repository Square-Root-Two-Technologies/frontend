import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomeScreen from "./components/HomeScreen/HomeScreen";
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

function App() {
  return (
    <ThemeProvider>
      <UserState>
        <NoteState>
          <Router>
            {/* Main container */}
            <div className="flex flex-col min-h-screen bg-background dark:bg-dark">
              {/* Navbar is now position:fixed */}
              <Navbar />

              {/* --- MODIFIED HERE --- */}
              {/* Added pt-16 (padding-top: 4rem) to account for Navbar's h-16 */}
              <main className="flex-grow w-full pt-16">
                <Routes>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/blogspace" element={<BlogSpace />} />
                  <Route path="/blog/:id" element={<SingleBlogPage />} />
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
                      <div className="container mx-auto px-4 py-12">
                        <div className="p-6 text-center text-xl text-error bg-red-100 dark:bg-red-900/20 rounded-md">
                          404 - Page Not Found
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </main>

              {/* Optional Footer could go here */}
            </div>
          </Router>
        </NoteState>
      </UserState>
    </ThemeProvider>
  );
}

export default App;
