import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from "@/config/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiV1 = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Interceptor de request: agrega Authorization si hay token
const authInterceptor = (config: AxiosRequestConfig) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(authInterceptor);
apiV1.interceptors.request.use(authInterceptor);

// 🚨 Interceptor de respuesta: solo expira sesión en ciertos casos
const errorInterceptor = (error: AxiosError) => {
  const status = error.response?.status;
  const url = error.config?.url || "";
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

  // Si no es 401/403 o no hay token, NO es "sesión expirada"
  if (!(status === 401 || status === 403) || !token) {
    return Promise.reject(error);
  }

  // No tratar estos endpoints como "sesión expirada"
  const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/register");
  const isBlogEndpoint = url.includes("/blogs");
  const isOrdersEndpoint = url.includes("/orders");


  if (isAuthEndpoint || isBlogEndpoint || isOrdersEndpoint) {
    // Deja que el componente maneje el error (credenciales malas o blog sin backend)
    return Promise.reject(error);
  }

  // 👉 Aquí sí: token existente + 401 en algo protegido real = sesión expirada
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);

  if (window.location.pathname !== "/login") {
    window.location.href = "/login?expired=true";
  }

  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, errorInterceptor);
apiV1.interceptors.response.use((response) => response, errorInterceptor);

export default api;
