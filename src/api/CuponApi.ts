import { api, CustomResponse } from ".";
import { BaseApi, IBaseObjectApi } from "./Api";
import { Where } from "./Where";

export interface ICuponApi extends IBaseObjectApi {
  used: number;
  maxUsed: number;
  cuponCode: string;
  expired: boolean;
  percentDiscount: number;
  expiredDate: Date;
}

export type CuponBody = Omit<ICuponApi, "id" | "createdAt" | "updatedAt" | "expired" | "used">;

class CuponApi extends BaseApi<CuponBody, ICuponApi> {
  async create(body: CuponBody): Promise<CustomResponse<ICuponApi>> {
    const response = await api.post(`/cupons`, body);
    const { data } = response;
    return data;
  }

  async fetchAll(where = new Where()): Promise<CustomResponse<ICuponApi[]>> {
    const response = await api.get(`/cupons`, { params: { where: where.build() } });
    const { data } = response;
    return data;
  }

  async fetchOneById(id: number): Promise<CustomResponse<ICuponApi>> {
    const response = await api.get(`/cupons/${id}`);
    const { data } = response;
    return data;
  }

  async update(id: number, body: CuponBody): Promise<CustomResponse<ICuponApi>> {
    const response = await api.post(`/cupons/${id}`, body);
    const { data } = response;
    return data;
  }

  delete(id: number): Promise<CustomResponse<null>> {
    throw new Error("Method not implemented.");
  }

  async validate(code: string): Promise<CustomResponse<ICuponApi>> {
    const response = await api.get(`/cupons/use/${code}`);
    const { data } = response;
    return data;
  }
}

export const CuponInstanceApi = new CuponApi();
