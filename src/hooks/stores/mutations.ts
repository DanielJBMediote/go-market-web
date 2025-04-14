import { IStoreApi, StoreInstanceApi } from "@/api/StoreApi";
import { CreateStoreType } from "@/app/manager/stores/components/store-form-modal";
import { useModalContext } from "@/contexts/modal-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface StoreMutationProps {
  initialData?: IStoreApi;
}

export function useStoreMutation({ initialData }: StoreMutationProps) {
  const queryClient = useQueryClient();
  const { closeModal } = useModalContext();

  const mutation = useMutation({
    mutationFn: async (data: CreateStoreType) => {
      const { name, slug, description, isActive, file } = data;
      if (initialData) {
        const id = initialData.id;
        return await StoreInstanceApi.update(id, { name, slug, description, isActive, file });
      } else {
        return await StoreInstanceApi.create({ name, slug, description, isActive, file });
      }
    },
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      if (initialData) {
        closeModal();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

export function useStoreDeleteMutation({ id }: { id: number }) {
  const { closeModal } = useModalContext();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await StoreInstanceApi.delete(id);
    },
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
