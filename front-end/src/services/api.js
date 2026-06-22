import axios from "axios";

console.log("DEBUG - VITE_API_URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

console.log("DEBUG - axios baseURL:", api.defaults.baseURL);

export default api;
