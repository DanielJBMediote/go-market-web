import { ProductInstaceApi } from "@/api/ProductApi";
import { queryConfigs } from "@/hooks/query-setup";
import { useQuery } from "@tanstack/react-query";

const QUERY_KEY = "product-comments";

export function useProductCommentsQuery({ id }: { id?: number }) {
  const query = useQuery({
    queryKey: [QUERY_KEY, { id }],
    queryFn: async () => {
      const { data } = await ProductInstaceApi.fetchComments(id!);
      return data;
    },
    throwOnError: (error) => {
      throw new Error("Error fetching store: ", error);
    },
    enabled: !!id,
    initialData: [],
    placeholderData: [],
    ...queryConfigs,
  });

  return query;
}
