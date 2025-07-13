import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // This will read from .env
  withCredentials: true, // if you're using cookies
});

export default api;
