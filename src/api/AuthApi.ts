import { api, CustomResponse } from ".";
import type { IUserApi, IUserDataCreate } from "./UserApi";

export interface IAuthData {
  username: string;
  password: string;
}

export interface IUserContext extends Omit<IUserApi, "password"> {
  accessKey: string;
}

class AuthApi {
  async signUp(data: IUserDataCreate) {
    return await api.post<CustomResponse<IUserApi>>(`/auth/sign-up`, data);
  }

  async signIn({ username, password }: IAuthData) {
    return await api.post<IUserContext>(`/auth/sign-in`, { username, password });
  }

  async me(token: string) {
    return await api.get<IUserContext>(`/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const AuthInstanceApi = new AuthApi();
