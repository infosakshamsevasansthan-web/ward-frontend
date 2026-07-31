import axios from "axios";

const isLocal = window.location.hostname === "localhost";

const API = axios.create({
  baseURL: isLocal
    ? "http://localhost:5000/api"
    : "https://ward-backend-kcw8.onrender.com/api",
});

console.log("APP START");
console.log("BASE URL =", API.defaults.baseURL);

export default API;
