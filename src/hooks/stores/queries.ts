import { IStoreApi, StoreDashboardMetrics, StoreInstanceApi } from "@/api/StoreApi";
import { Where } from "@/api/Where";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "../handle-filter";
import { queryConfigs } from "../query-setup";
import { StoreKeys } from "./filters";

interface StoresQueryProps {
  filters: Filter<StoreKeys>[];
}

export function useStoresQuery({ filters }: StoresQueryProps) {
  const query = useQuery<IStoreApi[]>({
    queryKey: ["stores", { filters }],
    queryFn: async () => {
      const where = new Where<StoreKeys>();
      where.addFilters(filters);
      const response = await StoreInstanceApi.fetchAll(where);
      const { data } = response.data;
      return data;
    },
    initialData: [],
    placeholderData: [],
    ...queryConfigs,
  });

  return query;
}

export function useStoreQuery({ id }: { id: number }) {
  const query = useQuery<IStoreApi | null>({
    queryKey: ["stores", { id }],
    queryFn: async () => {
      const response = await StoreInstanceApi.fetchOneById(id);
      const { data } = response.data;
      return data;
    },
    enabled: !!id,
    initialData: null,
    placeholderData: null,
    ...queryConfigs,
  });

  return query;
}

export function useDashboardMetricsByStoreId({ id }: { id: number }) {
  const query = useQuery<StoreDashboardMetrics | null>({
    queryKey: ["store-dashboard-metrics", { id }],
    queryFn: async () => {
      const response = await StoreInstanceApi.getDashboardMetricsByStoreId(id);
      const { data } = response.data;
      return data;
    },
    enabled: !!id,
    initialData: null,
    placeholderData: null,
    ...queryConfigs,
  });

  return query;
}

export function useDashboardMetrics() {
  const query = useQuery<StoreDashboardMetrics | null>({
    queryKey: ["store-dashboard-metrics"],
    queryFn: async () => {
      const response = await StoreInstanceApi.getDashboardMetrics();
      const { data } = response.data;
      return data;
    },
    initialData: null,
    placeholderData: null,
    ...queryConfigs,
  });

  return query;
}
