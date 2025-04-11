import { OrderBody, OrderInstanceApi } from "@/api/OrderApi";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useOrderMutation() {
  return useMutation({
    mutationFn: async (body: OrderBody) => {
      const { data } = await OrderInstanceApi.create(body);
      return data;
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Erro inesperado ao processar o pedido.";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success(`Order created successfully!`);
    },
  });
}
