import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const NavbarNav = () => {
  let location = useLocation();
  let navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <>
      <nav>
        <div className="main-nav flex">
          <Link to="/" className="company-logo">
            <div className="companyLogoNav">
              <h2>√2</h2>
            </div>
          </Link>
          <div className="nav-links flex" id="nav-links">
            <ul className="flex">
              <li>
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link ${
                    location.pathname === "/blogspace" ? "active" : ""
                  }`}
                  aria-current="page"
                  to={!localStorage.getItem("token") ? "/login" : "/blogspace"}
                >
                  Blog Space
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            {!localStorage.getItem("token") ? (
              <form className="d-flex">
                <Link
                  className="btn btn-primary mx-1"
                  to="/login"
                  role="button"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-primary mx-1"
                  to="/signup"
                  role="button"
                >
                  Signup
                </Link>
              </form>
            ) : (
              <button className="btn btn-primary" onClick={handleLogout}>
                Log Out
              </button>
            )}
          </div>
          <Link to="/" className="nav-toggle hover-link" id="nav-toggle">
            <i className="fa-solid fa-bars"></i>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavbarNav;
