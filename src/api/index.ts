import axios, { AxiosError } from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const API_DELAY = false;

// Interceptor de requisição
api.interceptors.request.use(async (config) => {
  // Delay artificial (opcional)
  if (API_DELAY) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Verifica se está no navegador (client-side)
  if (typeof window !== "undefined") {
    // Verifica se a requisição é para uma rota de autenticação
    const isAuthRoute =
      config.url && ["/auth/sign-in", "/auth/sign-up"].includes(window.location.pathname);

    // Se não for uma rota de autenticação, verifica o token
    if (!isAuthRoute) {
      const token = localStorage.getItem("@go-market-web:api-token");
      if (!token) {
        return Promise.reject();
      }

      // Adiciona o token ao cabeçalho da requisição
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response, // Retorna a resposta diretamente se não houver erro
  (error: AxiosError | undefined) => {
    if (!error) {
      localStorage.removeItem("@go-market-web:api-token");

      window.location.href = "/auth/sign-in"; // Redireciona para a página de login
      console.error("An unknown error occurred.");
      return Promise.reject(new Error("An unknown error occurred."));
    }
    if (error.response) {
      if ([403, 401].includes(error.response.status)) {
        // Token expirado ou inválido
        localStorage.removeItem("@go-market-web:api-token"); // Remove o token inválido
        window.location.href = "/auth/sign-in"; // Redireciona para a página de login
      }
    }
    return Promise.reject(error);
  }
);

export interface IAxiosErr {
  code: string;
  status: number;
  message: string;
  response?: {
    data?: AxiosError;
    status?: number;
  };
}
