import "./App.css";
import React from "react";
import Navbar_2 from "./components/Navbar_2/Navbar.js";
//import Navbar_1 from "./components/Navbar/Navbar.js";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import Signup from "./components/SignUp/Signup.js";
import Login from "./components/Login/Login.js";
import HomeRootTwo from "./components/HomeRootTwo/HomeRootTwo.js";
import { Route, Routes } from "react-router-dom";
import BlogSpace from "./components/BlogSpace/BlogSpace.js";
import Blogs from "./components/BlogSpace/Blogs";
import ManageBlogs from "./components/BlogSpace/Write/ManageBlogs.js";
import Blog from "./components/BlogSpace/Blog/Blog.js";
import SpaceScene from "./components/Demos/Astronomy/SpaceScene.js";
import HomeScreenFebAstronomy from "./components/Demos/HomeScreenFebAstronomy/HomeScreenFebAstronomy.js";
import HomeScreenFinalBoss from "./components/Demos/HomeScreenFinalBoss/HomeScreenFinalBoss.js";
import HomeScreenWithAnimation from "./components/Demos/HomeScreenWithAnimation/HomeScreenWithAnimation.js";
import HomeScreenJp from "./components/Demos/JapaneseWebDesign/HomeScreenJp.js";

function App() {
  return (
    <>
      <NoteState>
        <Navbar_2 />
        <Routes>
          <Route path="/" element={<HomeScreenFinalBoss />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogspace" element={<BlogSpace />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/manageblogs" element={<ManageBlogs />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/demo/scene/" element={<SpaceScene />} />
          <Route path="/demo/homescreenjp/" element={<HomeScreenJp />} />
          {/* <Route path="/home" element={<HomeScreenFinalBoss />} /> */}
          <Route
            path="/HomeScreenWithAnimation"
            element={<HomeScreenWithAnimation />}
          />
        </Routes>
      </NoteState>
    </>
  );
}

export default App;
