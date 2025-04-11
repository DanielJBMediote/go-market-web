import { api } from ".";
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

class StoreApi extends BaseApi<StoreBody> {
  async create(data: StoreBody) {
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (data.file) formData.append("file", data.file);
    return await api.post<IStoreApi>("/stores", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  async fetchAll(where = new Where()) {
    return await api.get<IStoreApi[]>(`/stores`, { params: { where: where.build() } });
  }
  async fetchOneById(id: number) {
    return await api.get<IStoreApi>(`/stores/${id}`);
  }
  async update(id: number, data: StoreBody) {
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (data.file) formData.append("file", data.file);
    return await api.put<IStoreApi>(`/stores/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async getDashboardMetricsByStoreId(id: number) {
    return await api.get<StoreDashboardMetrics>(`/stores/${id}/dashboard-metrics`);
  }

  async getDashboardMetrics() {
    return await api.get<StoreDashboardMetrics>(`/stores/dashboard-metrics`);
  }

  async delete(id: number) {
    return await api.delete(`/stores/${id}`);
  }
}

export const StoreInstanceApi = new StoreApi();
