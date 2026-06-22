import axios from "axios";

const baseURL = "https://dietetica-bah4.onrender.com";
console.log("DEBUG - baseURL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true
});

console.log("DEBUG - axios baseURL:", api.defaults.baseURL);

export default api;
