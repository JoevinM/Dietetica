import axios from "axios";

const api = axios.create({
  baseURL: "https://dietetica-t86m.onrender.com",
  withCredentials: true // permet de lire le cookie
});

export default api;
