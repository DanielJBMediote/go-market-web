"use client";

import { AUTH_UNAUTHORIZED_EVENT, IAxiosErr, AUTH_TOKEN } from "@/api";
import { AuthInstanceApi, IAuthData, IUserContext } from "@/api/AuthApi";
import { Roles } from "@/api/UserApi";
import { Loading } from "@/components/ui/loading";
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

function isPublicRoute(pathname: string | null) {
  return !pathname || pathname === "/" || pathname.startsWith("/auth/");
}

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const [userContext, setUserContext] = useState<IUserContext | null>(null);
  const [resolvedPath, setResolvedPath] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const isPublic = isPublicRoute(pathname);
    const token = localStorage.getItem(AUTH_TOKEN);

    if (!token) {
      setUserContext(null);
      if (isPublic) setResolvedPath(pathname);
      else router.replace("/auth/sign-in");

      return () => {
        active = false;
      };
    }

    if (pathname === "/auth/sign-up") {
      setResolvedPath(pathname);
      return () => {
        active = false;
      };
    }

    AuthInstanceApi.me(token)
      .then(({ data }) => {
        if (!active) return;
        setUserContext(data);
        setResolvedPath(pathname);
      })
      .catch((error) => {
        if (!active) return;
        const err = error as IAxiosErr;
        const status = err.status ?? err.response?.status;

        if ([401, 403].includes(status ?? 0)) {
          localStorage.removeItem(AUTH_TOKEN);
          setUserContext(null);
          if (isPublic) setResolvedPath(pathname);
          else router.replace("/auth/sign-in");
          return;
        }

        // A network/server failure does not prove the saved session is invalid.
        setResolvedPath(pathname);
      });

    return () => {
      active = false;
    };
  }, [router, pathname]);

  useEffect(() => {
    function handleUnauthorized() {
      localStorage.removeItem(AUTH_TOKEN);
      setUserContext(null);

      if (isPublicRoute(pathname)) {
        setResolvedPath(pathname);
      } else {
        setResolvedPath(null);
        router.replace("/auth/sign-in");
      }
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [pathname, router]);

  async function login(authData: IAuthData) {
    try {
      const { password, username } = authData;
      const { data } = await AuthInstanceApi.signIn({
        username,
        password,
      });

      setUserContext(data);
      localStorage.setItem(AUTH_TOKEN, data.accessKey);

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
    localStorage.removeItem(AUTH_TOKEN);
    router.push("/auth/sign-in");
    queryClient.removeQueries();
  }

  const value = { userContext, login, logout };

  if (!isPublicRoute(pathname) && resolvedPath !== pathname) {
    return <Loading label="Checking your session..." className="min-h-screen" />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthentication() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthentication must be used within an AuthProvider");
  }

  return context;
}
