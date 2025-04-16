import { api, CustomResponse } from ".";
import { BaseApi, IBaseObjectApi } from "./Api";
import { Where } from "./Where";

export interface ICategoryApi extends IBaseObjectApi {
  name: string;
  subName: string;
  code: string;
}

type CategoryBody = Pick<ICategoryApi, "name" | "subName">;

class CategoryApi extends BaseApi<CategoryBody, ICategoryApi> {
  async create(body: CategoryBody) {
    const response = await api.post<CustomResponse<ICategoryApi>>(`/categories`, body);
    const { data } = response;
    return data;
  }

  async fetchAll(where = new Where<ICategoryApi>()) {
    const response = await api.get<CustomResponse<ICategoryApi[]>>(`/categories`, {
      params: { where: where.build() },
    });
    const { data } = response;
    return data;
  }

  async fetchOneById(id: number) {
    const response = await api.get<CustomResponse<ICategoryApi>>(`/categories/${id}`);
    const { data } = response;
    return data;
  }

  async update(id: number, body: CategoryBody) {
    const response = await api.put<CustomResponse<ICategoryApi>>(`/categories/${id}`, body);
    const { data } = response;
    return data;
  }

  async delete(id: number) {
    const response = await api.delete<CustomResponse<null>>(`/categories/${id}`);
    const { data } = response;
    return data;
  }
}

export const CategoryInstanceApi = new CategoryApi();
