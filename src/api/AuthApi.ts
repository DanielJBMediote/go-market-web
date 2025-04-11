import { api } from ".";
import { IUserApi } from "./UserApi";

export interface IAuthData {
  username: string;
  password: string;
}

export interface IUserContext extends Omit<IUserApi, "password"> {
  accessKey: string;
}

class AuthApi {
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
