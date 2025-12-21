import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// 👇 BURASI ÇOK ÖNEMLİ: Her isteğin içine Token'ı gizlice koyar
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
