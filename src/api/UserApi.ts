import { api } from ".";
import { BaseApi, IBaseObjectApi } from "./Api";

export enum Roles {
  CLIENT = "CLIENT",
  MANAGER = "MANAGER",
}

export interface IUserApi extends IBaseObjectApi {
  name: string;
  email: string;
  username: string;
  password: string;
  role: Roles;
}

export type IUserDataCreate = Omit<IUserApi, "id" | "createdAt" | "updatedAt">;
export type IUserDataRead = Omit<IUserApi, "password">;

class UserApi extends BaseApi<IUserDataCreate> {
  async create({ email, name, password, role, username }: IUserDataCreate) {
    return await api.post<IUserApi>(`/users`, {
      email,
      name,
      password,
      role,
      username,
    });
  }

  async fetchAll() {
    return await api.get<IUserApi[]>(`/users`);
  }

  async fetchOneById(userId: number) {
    return await api.get<IUserApi>(`/users/${userId}`);
  }

  async update(userId: number, { email, name, username }: IUserDataCreate) {
    return await api.patch<IUserApi>(`/users/${userId}`, {
      email,
      name,
      username,
    });
  }

  async delete(userId: number) {
    return await api.patch(`/users/${userId}`);
  }
}

export const UserInstanceApi = new UserApi();
