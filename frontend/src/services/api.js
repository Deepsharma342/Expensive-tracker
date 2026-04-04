import axios from "axios";

const API = axios.create({
  baseURL: "https://darling-daffodil-9db119.netlify.app/api",
});

// 🔥 ADD THIS (important)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;