import { CuponBody, CuponInstanceApi, ICuponApi } from "@/api/CuponApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CuponsMutationProps {
  initialData: ICuponApi;
}

export function useCuponsMutation({ initialData }: CuponsMutationProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CuponBody) => {
      return initialData
        ? await CuponInstanceApi.update(initialData.id, data)
        : await CuponInstanceApi.create(data);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.resetQueries({ queryKey: ["cupons"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

export function useCuponValidateMutation() {
  const mutation = useMutation({
    mutationFn: async (code: string) => {
      return await CuponInstanceApi.validate(code);
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
