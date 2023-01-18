import "./App.css";
import NavbarNav from "./components/Navbar/Navbar.js";
import Home from "./components/Home/Home.js";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import Signup from "./components/Signup";
import Login from "./components/Login";
import HomeRootTwo from "./components/HomeRootTwo/HomeRootTwo.js";
import { Route, Routes } from "react-router-dom";
import BlogSpace from "./components/BlogSpace/BlogSpace.js";
import Blogs from "./components/BlogSpace/Blogs";

function App() {
  return (
    <>
      <NoteState>
        <Routes>
          <Route path="/" element={<HomeRootTwo />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogspace" element={<BlogSpace />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </NoteState>
    </>
  );
}

export default App;
