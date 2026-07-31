import axios from 'axios';

// अगर आप अपने कंप्यूटर पर टेस्ट कर रहे हैं तो 'localhost' चलेगा
const isLocal = window.location.hostname === "localhost";

const API = axios.create({
  baseURL: isLocal 
    ? 'http://localhost:5000/api' 
    : 'https://ward-backend-kcW8.onrender.com/api' // <--- यहाँ अपना Render Web Service वाला लिंक डालें (डेटाबेस का नहीं)
});

export default API;