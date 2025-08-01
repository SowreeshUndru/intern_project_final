import axios from 'axios';

const axiosinstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the token dynamically before every request
axiosinstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosinstance;
