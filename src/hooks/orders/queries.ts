import { IOrderApi, OrderInstanceApi } from "@/api/OrderApi";
import { Where } from "@/api/Where";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "../handle-filter";
import { queryConfigs } from "../query-setup";
import { OrderKeys } from "./filters";

const QUERY_KEY = "orders";

interface OrderQueryProps {
  filters: Filter<OrderKeys>[];
}

export function useOrdersQuery({ filters }: OrderQueryProps) {
  const query = useQuery<IOrderApi[]>({
    queryKey: [QUERY_KEY, { filters }],
    queryFn: async () => {
      const where = new Where<IOrderApi>();
      where.addFilters(filters);
      const { data } = await OrderInstanceApi.fetchAll(where);
      return data;
    },
    initialData: [],
    placeholderData: [],
    ...queryConfigs,
  });

  return query;
}
