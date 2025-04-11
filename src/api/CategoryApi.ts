import { AxiosResponse } from "axios";
import { api } from ".";
import { BaseApi, IBaseObjectApi } from "./Api";
import { Where } from "./Where";

export interface ICategoryApi extends IBaseObjectApi {
  name: string;
  subName: string;
}

type CategoryBody = Pick<ICategoryApi, "name" | "subName">;

class CategoryApi extends BaseApi<CategoryBody> {
  async create(body: CategoryBody) {
    return await api.post(`/categories`, body);
  }

  async fetchAll(where = new Where<ICategoryApi>()) {
    return await api.get<ICategoryApi[]>(`/categories`, { params: { where: where.build() } });
  }

  async fetchOneById(id: number): Promise<AxiosResponse> {
    return await api.get<ICategoryApi>(`/categories/${id}`);
  }

  async update(id: number, body: CategoryBody): Promise<AxiosResponse> {
    return await api.put(`/categories/${id}`, body);
  }

  async delete(id: number): Promise<AxiosResponse> {
    return await api.delete(`/categories/${id}`);
  }
}

export const CategoryInstanceApi = new CategoryApi();
