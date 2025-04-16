import { api, CustomResponse } from ".";
import { BaseApi, IBaseObjectApi } from "./Api";

interface ICuponApi extends IBaseObjectApi {
  used: number;
  maxUsed: number;
  cuponCode: string;
  expired: boolean;
  percentDiscount: number;
  expiredDate: Date;
}

type CuponBody = Omit<ICuponApi, "id" | "createdAt" | "updatedAt" | "expired" | "used">;

class CuponApi extends BaseApi<CuponBody, ICuponApi> {
  async create(body: CuponBody): Promise<CustomResponse<ICuponApi>> {
    const response = await api.post<CustomResponse<ICuponApi>>(`/cupons`, body);
    const { data } = response;
    return data;
  }

  fetchAll(): Promise<CustomResponse<ICuponApi[]>> {
    throw new Error("Method not implemented.");
  }
  fetchOneById(id: number): Promise<CustomResponse<ICuponApi>> {
    throw new Error("Method not implemented.");
  }
  update(id: number, body: CuponBody): Promise<CustomResponse<ICuponApi>> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<CustomResponse<null>> {
    throw new Error("Method not implemented.");
  }
}
