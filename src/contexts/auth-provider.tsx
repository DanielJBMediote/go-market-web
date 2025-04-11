"use client";

import { IAxiosErr } from "@/api";
import { AuthInstanceApi, IAuthData, IUserContext } from "@/api/AuthApi";
import { Roles } from "@/api/UserApi";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthContextProps {
  userContext?: IUserContext | null;

  login: (data: IAuthData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const [userContext, setUserContext] = useState<IUserContext | null>(null);

  useEffect(() => {
    if (["/auth/sign-up"].includes(pathname)) return;
    const token = localStorage.getItem("@go-market-web:api-token");
    if (token) {
      const fetchUser = async () => {
        try {
          const { data } = await AuthInstanceApi.me(token);
          setUserContext(data);
        } catch {
          toast.warning("User not authenticate, redirect to login...");
          // router.push("/auth/sign-in");
        }
      };

      fetchUser();
    }
  }, [router, pathname]);

  async function login(authData: IAuthData) {
    try {
      const { password, username } = authData;
      const { data } = await AuthInstanceApi.signIn({
        username,
        password,
      });

      setUserContext(data);
      localStorage.setItem("@go-market-web:api-token", data.accessKey);

      if (data.role == Roles.MANAGER) {
        router.push("/manager/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      const err = error as IAxiosErr;
      toast.error(err.message);
      queryClient.removeQueries();
    }
  }

  async function logout() {
    setUserContext(null);
    localStorage.removeItem("@go-market-web:api-token");
    router.push("/auth/sign-in");
    queryClient.removeQueries();
  }

  const value = { userContext, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthentication() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthentication must be used within an AuthProvider");
  }

  return context;
}
