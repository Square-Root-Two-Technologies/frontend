import React from "react";
import SpaceScene from "../Astronomy/SpaceScene"; // Your animation component
import Navbar from "../../Navbar_2/Navbar.js";
import "./style.css";

const HomeScreenFebAstronomy = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div className="main-content">
        <div className="left-section">
          <div className="animation-window">
            <SpaceScene />
          </div>
        </div>
        <div className="right-section">
          <h1>Square Root Two Technologies</h1>
          <p>Finite problems | Infinite Solutions</p>
          <button>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreenFebAstronomy;
