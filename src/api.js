import axios from 'axios';

// यह चेक करेगा कि साइट लोकल चल रही है या Vercel पर
const isLocal = window.location.hostname === "localhost";

const API = axios.create({
  baseURL: isLocal 
    ? 'http://localhost:5000/api' 
    : 'https://ward-backend-kcW8.onrender.com/api' // <--- यहाँ पक्का करें कि आपका Render बैकएंड लिंक सही है
});

export default API;