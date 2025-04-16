import { api, CustomResponse } from ".";
import { BaseApi, IBaseObjectApi } from "./Api";
import { IFileApi } from "./FileApi";
import { IProductApi } from "./ProductApi";
import { IUserApi } from "./UserApi";
import { Where } from "./Where";

export interface IStoreApi extends IBaseObjectApi {
  name: string;
  slug?: string;
  description: string;
  isActive: boolean;
  imageSource?: string;
  likes?: number;
  products: IProductApi[];
  owner: IUserApi;
  logo?: IFileApi;
}

interface StoreBody
  extends Omit<IStoreApi, "id" | "createdAt" | "updatedAt" | "products" | "owner" | "logo"> {
  file?: File;
}

export type StoreChartData = {
  day: number;
  units: number;
  revenue: number;
};
export type StoreDashboardMetrics = {
  store: IStoreApi;
  monthlySales: number;
  dailySales: number;
  averageDaily: number;
  monthlyRevenue: number;
  diffDailySalesPercent: number;
  diffMonthlySalesPercent: number;
  diffMonthlyRevenuePercent: number;
  diffDailyAvarageSalesPercent: number;
  dataChart: StoreChartData[];
};

class StoreApi extends BaseApi<StoreBody, IStoreApi> {
  async create(body: StoreBody) {
    const formData = new FormData();

    formData.append("data", new Blob([JSON.stringify(body)], { type: "application/json" }));
    if (body.file) formData.append("file", body.file);

    const response = await api.post<CustomResponse<IStoreApi>>("/stores", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { data } = response;
    return data;
  }

  async fetchAll(where = new Where()) {
    const response = await api.get<CustomResponse<IStoreApi[]>>(`/stores`, {
      params: { where: where.build() },
    });
    const { data } = response;
    return data;
  }

  async fetchOneById(id: number) {
    const response = await api.get<CustomResponse<IStoreApi>>(`/stores/${id}`);
    const { data } = response;
    return data;
  }
  async update(id: number, body: StoreBody) {
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(body)], { type: "application/json" }));
    if (body.file) formData.append("file", body.file);
    const response = await api.put<CustomResponse<IStoreApi>>(`/stores/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { data } = response;
    return data;
  }

  async getDashboardMetricsByStoreId(id: number) {
    const response = await api.get<CustomResponse<StoreDashboardMetrics>>(
      `/stores/${id}/dashboard-metrics`
    );
    const { data } = response;
    return data;
  }

  async getDashboardMetrics() {
    const response = await api.get<CustomResponse<StoreDashboardMetrics>>(
      `/stores/dashboard-metrics`
    );
    const { data } = response;
    return data;
  }

  async delete(id: number) {
    const response = await api.delete<CustomResponse<null>>(`/stores/${id}`);
    const { data } = response;
    return data;
  }
}

export const StoreInstanceApi = new StoreApi();
