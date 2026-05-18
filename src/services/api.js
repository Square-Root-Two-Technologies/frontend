import { API_BASE } from "../config/constants";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { "auth-token": token } : {};
};

export const api = {
  get: (path, auth = false) =>
    fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(auth ? authHeader() : {}) },
    }),
  post: (path, body, auth = false) =>
    fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(auth ? authHeader() : {}) },
      body: JSON.stringify(body),
    }),
  put: (path, body, auth = false) =>
    fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(auth ? authHeader() : {}) },
      body: JSON.stringify(body),
    }),
  delete: (path, auth = false) =>
    fetch(`${API_BASE}${path}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...(auth ? authHeader() : {}) },
    }),
};
