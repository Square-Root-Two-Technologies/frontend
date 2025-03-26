import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal"; // Added Modal import
import Button from "react-bootstrap/Button"; // Added Button import
import Form from "react-bootstrap/Form"; // Added Form import
import Spinner from "react-bootstrap/Spinner"; // Added Spinner import
import "./Navbar.css";

function Navbar_1() {
  let location = useLocation();
  let navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // State for modal visibility
  const [credentials, setCredentials] = useState({ email: "", password: "" }); // Login credentials
  const [loading, setLoading] = useState(false); // Loading state

  const backendURI = `${process.env.REACT_APP_BACKEND}/api/auth/login`;

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(backendURI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        setLoading(false);
        setShowLogin(false);
        setCredentials({ email: "", password: "" });
        navigate("/");
      } else {
        setLoading(false);
        alert("Invalid credentials");
      }
    } catch (error) {
      setLoading(false);
      alert("An error occurred. Please try again.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

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
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="sticky-top navbar-light"
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand href="/">√2</Navbar.Brand>
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
                    location.pathname === "/manageblogs" ? "active" : ""
                  }`}
                  onClick={handleClick}
                  aria-current="page"
                  to={
                    !localStorage.getItem("token") ? "/login" : "/manageblogs"
                  }
                >
                  Write
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  className={`nav-link ${
                    location.pathname === "/blogspace" ? "active" : ""
                  }`}
                  onClick={handleClick}
                  aria-current="page"
                  to={"/blogspace"}
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
                  <Button
                    className="btn btn-primary mx-1"
                    onClick={() => {
                      setShowLogin(true);
                      handleClick();
                    }}
                  >
                    Login
                  </Button>
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
                <Button
                  className="btn btn-primary"
                  onClick={() => {
                    handleLogout();
                    handleClick();
                  }}
                >
                  Log Out
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Modal
        show={showLogin}
        onHide={() => setShowLogin(false)}
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={credentials.password}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100"
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" variant="light" />{" "}
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Navbar_1;
