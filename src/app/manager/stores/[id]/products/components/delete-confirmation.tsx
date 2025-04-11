import { IAxiosErr } from "@/api";
import { IProductApi, ProductInstaceApi } from "@/api/ProductApi";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/contexts/modal-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteConfirmationProps {
  product: IProductApi;
}

export function DeleteConfirmation({ product }: DeleteConfirmationProps) {
  const { closeModal } = useModal();
  const queryClent = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      return await ProductInstaceApi.delete(product.id);
    },
    onError: (error) => {
      const err = error.cause as IAxiosErr;
      // toast.error(error.data.message);
      toast.error(err.response?.data?.message);
    },
    onSuccess: () => {
      queryClent.invalidateQueries({ queryKey: ["products"] });
      closeModal();
    },
  });

  async function handleDeleteProduct() {
    await mutateAsync();
  }

  return (
    <DialogContent>
      <DialogTitle>Confirm delete this product?</DialogTitle>
      <DialogDescription>{product.name}</DialogDescription>
      <DialogFooter>
        <Button variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeleteProduct} isLoading={isPending}>
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
