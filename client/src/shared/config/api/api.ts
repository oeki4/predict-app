import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
// Базовый URL для API.
// Настраивается через переменную окружения VITE_API_URL,
// иначе по умолчанию будет использоваться http://localhost:8000.
const API_BASE_URL =
  'https://predict-back.ru.tuna.am/api/v1';

// Общий интерфейс ошибки API (при необходимости можно расширить под ваш бэкенд).
export interface ApiError<T = unknown> {
  status?: number;
  data?: T;
  message?: string;
}

// Создаём основной экземпляр axios.
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерсептор запросов
http.interceptors.request.use(
  (config) => {
    // showGlobalLoader();

    // Пример для добавления токена (при появлении поля token в сторе/локальном хранилище):
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`,
    //   };
    // }

    return config;
  },
  (error: AxiosError) => {
    // hideGlobalLoader();
    return Promise.reject(error);
  },
);

// Интерсептор ответов
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // hideGlobalLoader();
    return response;
  },
  (error: AxiosError) => {
    // hideGlobalLoader();

    const apiError: ApiError = {
      status: error.response?.status,
      data: error.response?.data,
      message:
        (error.response?.data as { detail?: string })?.detail ??
        error.message,
    };

    return Promise.reject(apiError);
  },
);

// Удобная обёртка над axios, возвращающая сразу data.
export const api = {
  get: async <T = unknown, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> => {
    const response = await http.get<T, AxiosResponse<T>, D>(url, config);
    return response.data;
  },

  post: async <T = unknown, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig<B>,
  ): Promise<T> => {
    const response = await http.post<T, AxiosResponse<T>, B>(
      url,
      body,
      config,
    );
    return response.data;
  },

  put: async <T = unknown, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig<B>,
  ): Promise<T> => {
    const response = await http.put<T, AxiosResponse<T>, B>(url, body, config);
    return response.data;
  },

  patch: async <T = unknown, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig<B>,
  ): Promise<T> => {
    const response = await http.patch<T, AxiosResponse<T>, B>(
      url,
      body,
      config,
    );
    return response.data;
  },

  delete: async <T = unknown, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> => {
    const response = await http.delete<T, AxiosResponse<T>, D>(url, config);
    return response.data;
  },
};

export default http;


