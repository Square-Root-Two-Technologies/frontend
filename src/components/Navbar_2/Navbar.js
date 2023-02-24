import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function Navbar_2() {
  let location = useLocation();
  let navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  function handleToggle() {
    setExpanded(!expanded);
  }
  function handleClick() {
    if (expanded) {
      handleToggle();
    }
  }
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="sticky-top navbar-light"
      expanded={expanded}
      style={{ backgroundColor: "white" }}
    >
      <Container>
        <Navbar.Brand href="#home"> √2</Navbar.Brand>
        <Navbar.Toggle
          onClick={handleToggle}
          aria-controls="responsive-navbar-nav"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                onClick={handleClick}
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
                onClick={handleClick}
                aria-current="page"
                to={!localStorage.getItem("token") ? "/login" : "/blogspace"}
              >
                Write
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className={`nav-link ${
                  location.pathname === "/blogs" ? "active" : ""
                }`}
                onClick={handleClick}
                aria-current="page"
                to={"/blogs"}
              >
                Read
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                className={`nav-link ${
                  location.pathname === "/about" ? "active" : ""
                }`}
                onClick={handleClick}
                to="/about"
              >
                About
              </Link>
            </Nav.Item>
          </Nav>
          <Nav>
            {!localStorage.getItem("token") ? (
              <form className="d-flex">
                <Link
                  className="btn btn-primary mx-1"
                  to="/login"
                  role="button"
                  onClick={handleClick}
                >
                  Login
                </Link>
                <Link
                  className="btn btn-primary mx-1"
                  to="/signup"
                  role="button"
                  onClick={handleClick}
                >
                  Signup
                </Link>
              </form>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleLogout();
                  handleClick();
                }}
              >
                Log Out
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar_2;
