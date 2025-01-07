import axios from "axios";

const axiosService = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kk-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosService;
