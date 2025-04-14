import { IOrderApi, OrderBody, OrderInstanceApi } from "@/api/OrderApi";
import { useModalContext } from "@/contexts/modal-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: OrderBody) => {
      const { data } = await OrderInstanceApi.create(body);
      return data as IOrderApi;
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

export function useOrderUpdateStatusMutation({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await OrderInstanceApi.updateStatus(id);
    },
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["orders", { id }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

export function useOrderCancelMutation({ id }: { id: number }) {
  const { closeModal } = useModalContext();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await OrderInstanceApi.cancelOrder(id);
    },
    onSuccess: () => {
      toast.success("Order has been canceled!");
      queryClient.invalidateQueries({ queryKey: ["orders", { id }] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
