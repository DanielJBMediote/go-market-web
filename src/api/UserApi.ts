import { api, CustomResponse } from ".";
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

class UserApi extends BaseApi<IUserDataCreate, IUserApi> {
  async create({ email, name, password, role, username }: IUserDataCreate) {
    const response = await api.post<CustomResponse<IUserApi>>(`/users`, {
      email,
      name,
      password,
      role,
      username,
    });

    const { data } = response;
    return data;
  }

  async fetchAll() {
    const response = await api.get<CustomResponse<IUserApi[]>>(`/users`);
    const { data } = response;
    return data;
  }

  async fetchOneById(userId: number) {
    const response = await api.get<CustomResponse<IUserApi>>(`/users/${userId}`);
    const { data } = response;
    return data;
  }

  async update(userId: number, { email, name, username }: IUserDataCreate) {
    const response = await api.put<CustomResponse<IUserApi>>(`/users/${userId}`, {
      email,
      name,
      username,
    });
    const { data } = response;
    return data;
  }

  async delete(userId: number) {
    const response = await api.delete<CustomResponse<null>>(`/users/${userId}`);
    const { data } = response;
    return data;
  }
}

export const UserInstanceApi = new UserApi();
