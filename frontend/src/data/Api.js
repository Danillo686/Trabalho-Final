import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Centraliza a URL do seu back-end aqui
});

export default api;