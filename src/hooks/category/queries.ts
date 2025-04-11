import { CategoryInstanceApi } from "@/api/CategoryApi";
import { useQuery } from "@tanstack/react-query";
import { queryConfigs } from "../query-setup";

const QUERY_KEY = "category";

export function useCategoryQuery() {
  const query = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data } = await CategoryInstanceApi.fetchAll();
      return data;
    },
    initialData: [],
    placeholderData: [],
    ...queryConfigs,
  });

  return query;
}
