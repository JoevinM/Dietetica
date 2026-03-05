import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true // permet de lire le cookie
});

export default api;
