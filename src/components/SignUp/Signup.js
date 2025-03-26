import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import rocket from "./assets/building_rockets_preview_rev_1.png";
import { Spinner } from "react-bootstrap";
import "./style.css";

function Signup() {
  const backendURI = `${process.env.REACT_APP_BACKEND}/api/auth/createuser`;
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    country: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, email, password, country, city } = credentials;
    if (credentials.password !== credentials.cpassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }
    const response = await fetch(backendURI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, country, city }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      setLoading(false);
      localStorage.setItem("token", json.authtoken);
      navigate("/");
    } else {
      alert("Invalid credentials");
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={credentials.name}
              onChange={onChange}
              placeholder="Enter Name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              placeholder="Enter email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              placeholder="Password"
              required
              minLength={5}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="cpassword"
              name="cpassword"
              value={credentials.cpassword}
              onChange={onChange}
              placeholder="Confirm Password"
              required
              minLength={5}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              type="text"
              className="form-control"
              id="country"
              name="country"
              value={credentials.country}
              onChange={onChange}
              placeholder="Which country are you from?"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={credentials.city}
              onChange={onChange}
              placeholder="Which city do you belong to?"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" variant="light" /> Signing
                you in...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
      <div className="signup-image-container">
        <img src={rocket} className="img-fluid signup-image" alt="Rocket" />
      </div>
    </div>
  );
}

export default Signup;
