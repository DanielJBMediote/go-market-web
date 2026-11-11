import axios, { AxiosError } from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const AUTH_TOKEN = "market-web:api-token";
export const AUTH_UNAUTHORIZED_EVENT = "go-market:unauthorized";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const API_DELAY = false;

api.interceptors.request.use(async (config) => {
  if (API_DELAY) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (typeof window !== "undefined") {
    const isPublicAuthRequest = ["/auth/sign-in", "/auth/sign-up"].includes(config.url ?? "");
    if (!isPublicAuthRequest) {
      const token = localStorage.getItem(AUTH_TOKEN);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export interface CustomResponse<T> {
  message: string;
  status: number;
  data: T;
}

export interface IAxiosErr {
  code: string;
  status: number;
  message: string;
  response?: {
    data?: unknown;
    status?: number;
  };
}

api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      (response.data.message || response.data.data)
    ) {
      response.data = {
        ...response.data,
        message: response.data.message,
        status: response.data.status ?? response.status,
        data: response.data.data,
      } as CustomResponse<unknown>;
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    const responseData = error.response?.data;
    if (responseData && typeof responseData === "object" && "message" in responseData) {
      return Promise.reject({
        ...responseData,
        status: error.response?.status,
        response: error.response,
      });
    }

    return Promise.reject(error);
  }
);
