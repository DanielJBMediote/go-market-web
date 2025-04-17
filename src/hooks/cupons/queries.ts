import { CuponInstanceApi } from "@/api/CuponApi";
import { useQuery } from "@tanstack/react-query";
import { queryConfigs } from "../query-setup";

const QUERY_KEY = "cupons";

export function useCuponsQuery() {
  const query = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data } = await CuponInstanceApi.fetchAll();
      return data;
    },
    initialData: [],
    placeholderData: [],
    ...queryConfigs,
  });

  return query;
}

export function useCuponQuery({ id }: { id: number }) {
  const query = useQuery({
    queryKey: [QUERY_KEY, { id }],
    queryFn: async () => {
      const { data } = await CuponInstanceApi.fetchOneById(id);
      return data;
    },
    enabled: !!id,
    initialData: null,
    placeholderData: null,
    ...queryConfigs,
  });

  return query;
}
