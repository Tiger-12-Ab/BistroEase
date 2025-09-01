import axios from "axios";

const API = axios.create({
  baseURL: "https://bistroease-backend.onrender.com/api",
});

// Attach token dynamically for every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
