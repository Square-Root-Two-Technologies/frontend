import "./App.css";
import React from "react";
import Navbar_2 from "./components/Navbar_2/Navbar.js";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import Signup from "./components/SignUp/Signup.js";
import Login from "./components/Login";
import HomeRootTwo from "./components/HomeRootTwo/HomeRootTwo.js";
import { Route, Routes } from "react-router-dom";
import BlogSpace from "./components/BlogSpace/BlogSpace.js";
import Blogs from "./components/BlogSpace/Blogs";
import ManageBlogs from "./components/BlogSpace/Write/ManageBlogs.js";
import Blog from "./components/BlogSpace/Blog/Blog";

function App() {
  return (
    <>
      <NoteState>
        <Navbar_2 />
        <Routes>
          <Route path="/" element={<HomeRootTwo />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogspace" element={<BlogSpace />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/manageblogs" element={<ManageBlogs />} />
          <Route path="/blog/:id" element={<Blog />} />
        </Routes>
      </NoteState>
    </>
  );
}

export default App;
