import { OrderBody, OrderInstanceApi } from "@/api/OrderApi";
import { useModalContext } from "@/contexts/modal-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useOrderMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: OrderBody) => {
      return await OrderInstanceApi.create(body);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.resetQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

export function useOrderUpdateStatusMutation({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await OrderInstanceApi.updateStatus(id);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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
      return await OrderInstanceApi.cancelOrder(id);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["orders", { id }] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
