// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import

const root = ReactDOM.createRoot(document.getElementById("root"));

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error("ERROR: REACT_APP_GOOGLE_CLIENT_ID is not set in .env file.");
}

root.render(
  <React.StrictMode>
    {/* Wrap App with the provider */}
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);

reportWebVitals();
