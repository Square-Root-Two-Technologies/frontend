import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
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
      <Navbar className="container-fluid bg-light navContainer" expand="lg">
        <div className=" me-auto mb-1 mb-lg-0">
          <div className="navbarLeft">
            <Link className="navbar-brand" to="/">
              √2
            </Link>
          </div>
          <div className="navbarRight">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="navbarCollapse" id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Item>
                  <Link
                    className={`nav-link ${
                      location.pathname === "/" ? "active" : ""
                    }`}
                    aria-current="page"
                    to="/"
                  >
                    Home
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    className={`nav-link ${
                      location.pathname === "/blogspace" ? "active" : ""
                    }`}
                    aria-current="page"
                    to={
                      !localStorage.getItem("token") ? "/login" : "/blogspace"
                    }
                  >
                    Blog Space
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    className={`nav-link ${
                      location.pathname === "/about" ? "active" : ""
                    }`}
                    to="/about"
                  >
                    About
                  </Link>
                </Nav.Item>
                <NavDropdown title="Our Services" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/">
                    <div
                      className={`nav-link ${
                        location.pathname === "/salesforce" ? "active" : ""
                      }`}
                    >
                      Salesforce
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/">
                    <div
                      className={`nav-link ${
                        location.pathname === "/javascript" ? "active" : ""
                      }`}
                    >
                      Javascript
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/">
                    <div
                      className={`nav-link ${
                        location.pathname === "/games" ? "active" : ""
                      }`}
                    >
                      Games
                    </div>
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="BlogSpace" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/">
                    <Link
                      className={`nav-link ${
                        location.pathname === "/blogs" ? "active" : ""
                      }`}
                      to="/blogs"
                    >
                      Read Blogs
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/">
                    <Link
                      className={`nav-link ${
                        location.pathname === "/blogspace" ? "active" : ""
                      }`}
                      to={
                        !localStorage.getItem("token") ? "/login" : "/blogspace"
                      }
                    >
                      Manage your own blogs
                    </Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <div className="loginsignup">
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
            </Navbar.Collapse>
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default NavbarNav;
