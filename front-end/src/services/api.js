import axios from "axios";

const api = axios.create({
  baseURL: "$VITE_API_URL",
  withCredentials: true // permet de lire le cookie
});

export default api;
