import axios from "axios";

const api = axios.create({
   baseURL: "https://ticket-api-197503629071.us-central1.run.app",
});

export default api;
