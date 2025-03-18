import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../Navbar_2/Navbar.js"; // Assuming you have a separate Navbar component
import SpaceScene from "../Astronomy/SpaceScene";
import BranchAnimation from "../BranchAnimation/AnimatedButtons";

const HomeScreenFinalBoss = () => {
  return (
    <div>
      <div
        className="container-fluid d-flex flex-column vh-100"
        style={{ overflow: "hidden", backgroundColor: "#1a1a1a" }} // Match SpaceScene background
      >
        {/* Main content area */}
        <div
          className="d-flex flex-column flex-lg-row flex-grow-1 p-3"
          style={{ height: "100%" }} // Ensure it fills remaining space
        >
          {/* Left Section - Space Scene Simulation */}
          <div
            id="left-section"
            className="col-lg-6 col-12 mb-3 mb-lg-0 p-4 rounded d-flex flex-column"
            style={{ flex: "1", overflow: "auto", backgroundColor: "#1a1a1a" }} // Equal height on mobile, scroll if needed
          >
            <SpaceScene /> {/* Render the SpaceScene component */}
          </div>

          {/* Right Section */}
          <div
            id="right-section"
            className="col-lg-6 col-12 p-4 rounded shadow d-flex flex-column justify-content-center align-items-center"
            style={{ flex: "1", overflow: "auto", backgroundColor: "#1a1a1a" }}
          >
            <div
              id="right-content"
              className="d-flex flex-column align-items-center"
              style={{ textAlign: "center" }} // Center text horizontally within this container
            >
              <h1 style={{ color: "#f4e3d3", fontSize: "2.5rem" }}>
                Square Root Two Technologies
              </h1>
              <p style={{ color: "#d9b8a2", fontSize: "1.25rem" }}>
                Finite problems | Infinite Solutions
              </p>
              <button
                className="btn"
                style={{
                  backgroundColor: "#a68a64", // Muted tan from SpaceScene lines
                  color: "#ffffff", // White text for contrast
                  border: "none",
                  padding: "5px 15px", // Smaller padding for a smaller button
                  fontSize: "0.875rem", // Smaller font size
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* About Section - Full Screen */}
      <div
        className="container-fluid d-flex flex-column align-items-center justify-content-center p-5"
        style={{
          minHeight: "100vh", // Full screen height
          backgroundColor: "#1a1a1a",
          color: "#f4e3d3",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>About Us</h2>
        <p style={{ maxWidth: "800px", fontSize: "1.5rem", color: "#d9b8a2" }}>
          At Square Root Two Technologies, we believe that every problem has an
          infinite number of solutions. Our mission is to innovate and create
          cutting-edge technology solutions that push the boundaries of
          possibility.
        </p>
        <p style={{ maxWidth: "800px", fontSize: "1.5rem", color: "#d9b8a2" }}>
          We specialize in automation, games, artificial intelligence, and
          software development—bringing futuristic ideas to life.
        </p>
      </div>
    </div>
  );
};

export default HomeScreenFinalBoss;
