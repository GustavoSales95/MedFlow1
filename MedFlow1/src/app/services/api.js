import axios from "axios";

// Conecta o front e o back com axios
const api = axios.create({
    baseURL: 'http://localhost:3333'
});

export default api