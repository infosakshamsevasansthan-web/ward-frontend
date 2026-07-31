import axios from 'axios';

console.log("APP START");
console.log(API.defaults.baseURL);
const isLocal = window.location.hostname === "localhost";

const API = axios.create({
  baseURL: isLocal 
    ? 'http://localhost:5000/api' 
    : 'https://ward-backend-kcW8.onrender.com/api' // <--- यहाँ पक्का करें कि आपका Render बैकएंड लिंक सही है
});

export default API;
