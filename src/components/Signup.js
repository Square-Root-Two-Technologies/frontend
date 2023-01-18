import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label>Name</label>
        <input
          type="name"
          className="form-control"
          id="name"
          name="name"
          onChange={onChange}
          aria-describedby="name"
          placeholder="Enter Name"
        />
      </div>
      <div className="form-group mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          name="email"
          onChange={onChange}
          aria-describedby="emailHelp"
          placeholder="Enter email"
        />
        <small id="emailHelp" className="form-text text-muted">
          We'll never share your email with anyone else.
        </small>
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          name="password"
          onChange={onChange}
          placeholder="Password"
          required
          minLength={5}
        />
      </div>
      <div className="form-group my-1">
        <label>Confirm Password</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword2"
          name="cpassword"
          onChange={onChange}
          placeholder="Password"
          required
          minLength={5}
        />
      </div>
      <button type="submit" className="btn btn-primary my-3">
        Submit
      </button>
    </form>
  );
}

export default Signup;
