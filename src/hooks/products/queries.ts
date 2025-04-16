import { IProductApi, ProductInstaceApi } from "@/api/ProductApi";
import { Where } from "@/api/Where";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "../handle-filter";
import { queryConfigs } from "../query-setup";
import { ProductKeys } from "./filters";

const QUERY_KEY = "products";

interface ProductQueryProps {
  storeId: number;
  filters: Filter<ProductKeys>[];
}

export function useProductByStoreIdQuery({ storeId, filters }: ProductQueryProps) {
  const query = useQuery<IProductApi[]>({
    queryKey: [QUERY_KEY, { storeId, filters }],
    queryFn: async () => {
      const where = new Where<ProductKeys>();
      where.addFilters(filters);
      where.addCondition("store.id", storeId, "EQUALS");
      const { data } = await ProductInstaceApi.fetchAll(where);
      return data;
    },
    enabled: !!storeId,
    initialData: [],
    placeholderData: [],
    ...queryConfigs,
  });

  return query;
}

export function useProductsQuery({ filters }: Pick<ProductQueryProps, "filters">) {
  const query = useQuery({
    queryKey: [QUERY_KEY, { filters }],
    queryFn: async () => {
      const where = new Where<ProductKeys>();
      where.addFilters(filters);
      const { data } = await ProductInstaceApi.fetchAll(where);
      return data;
    },
    initialData: [],
    placeholderData: [],
    ...queryConfigs,
  });

  return query;
}

export function useProductsFeaturedQuery({ filters }: Pick<ProductQueryProps, "filters">) {
  const query = useQuery({
    queryKey: [QUERY_KEY, { filters }],
    queryFn: async () => {
      const where = new Where<ProductKeys>();
      where.addFilters(filters);
      const { data } = await ProductInstaceApi.fetchAllFeatrued(where);
      return data;
    },
    initialData: [],
    placeholderData: [],
    ...queryConfigs,
  });

  return query;
}

export function useProductQuery({ id }: { id?: number }) {
  const query = useQuery({
    queryKey: [QUERY_KEY, { id }],
    queryFn: async () => {
      const { data } = await ProductInstaceApi.fetchOneById(id!);
      return data;
    },
    enabled: !!id,
    initialData: null,
    placeholderData: null,
    ...queryConfigs,
  });

  return query;
}
