import axios from "axios";
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from "@/config/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create separate instance for /api/v1 endpoints
export const apiV1 = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token (for both instances)
const authInterceptor = (config: any) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(authInterceptor);
apiV1.interceptors.request.use(authInterceptor);

// Response interceptor to handle errors (for both instances)
const errorInterceptor = (error: any) => {
  if (error.response?.status === 401) {
    // Clear auth data on unauthorized
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    
    // Redirect to login if not already there
    if (window.location.pathname !== "/login") {
      window.location.href = "/login?expired=true";
    }
  }
  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, errorInterceptor);
apiV1.interceptors.response.use((response) => response, errorInterceptor);

export default api;
