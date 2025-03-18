// HomeScreenJp.jsx
import React from "react";
import "./HomeScreenJp.css";

const HomeScreenJp = () => {
  return (
    <div className="home-screen-jp">
      {/* Main content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Left Column */}
          <aside className="sidebar">
            <div className="category-box">
              <h3>Categories</h3>
              <ul>
                <li>
                  <a href="#">JavaScript Basics</a>
                </li>
                <li>
                  <a href="#">Advanced JS</a>
                </li>
                <li>
                  <a href="#">Salesforce Tips</a>
                </li>
                <li>
                  <a href="#">Maps Integration</a>
                </li>
                <li>
                  <a href="#">DSA Concepts</a>
                </li>
              </ul>
            </div>
            <div className="search-box">
              <input type="text" placeholder="Search..." />
              <button>Go</button>
            </div>
          </aside>

          {/* Main Blog Section */}
          <section className="blog-section">
            <h2>Latest Tech Posts</h2>
            <div className="blog-list">
              <div className="blog-item">
                <a href="#">Mastering JavaScript Promises</a>
                <p>A deep dive into async programming - 03/16/2025</p>
              </div>
              <div className="blog-item">
                <a href="#">Salesforce Customization 101</a>
                <p>Learn to tweak Salesforce - 03/15/2025</p>
              </div>
              <div className="blog-item">
                <a href="#">Mapping with Salesforce</a>
                <p>Visualize data with Maps - 03/14/2025</p>
              </div>
              <div className="blog-item">
                <a href="#">Sorting Algorithms Explained</a>
                <p>Master DSA concepts - 03/13/2025</p>
              </div>
            </div>
          </section>

          {/* Right Column */}
          <aside className="right-bar">
            <div className="quick-links">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <a href="#">JS Reference</a>
                </li>
                <li>
                  <a href="#">SF Docs</a>
                </li>
                <li>
                  <a href="#">Code Samples</a>
                </li>
                <li>
                  <a href="#">Forum</a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      {/* Footer */}
      <footer className="footer">
        <p>
          © 2025 Tech Kawaii Blog - <a href="#">Terms</a> |{" "}
          <a href="#">Privacy</a> | <a href="#">Contact</a>
        </p>
      </footer>
    </div>
  );
};

export default HomeScreenJp;
