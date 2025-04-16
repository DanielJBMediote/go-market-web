import { IProductApi, ProductInstaceApi } from "@/api/ProductApi";
import { ProductTypeSchema } from "@/app/manager/stores/[id]/products/components/product-modal-form";
import { useModalContext } from "@/contexts/modal-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateProductMutationProps {
  storeId: number;
  initialData?: IProductApi;
}

export function useProductMutation({ storeId, initialData }: CreateProductMutationProps) {
  const queryClient = useQueryClient();
  const { closeModal } = useModalContext();

  const query = useMutation({
    mutationFn: async (data: ProductTypeSchema) => {
      const { name, price, description, category, isActive, isFeatured, files, images } = data;

      if (initialData) {
        const id = initialData.id;
        return await ProductInstaceApi.update(id, {
          name,
          price,
          description,
          category,
          isActive,
          isFeatured,
          store: { id: storeId },
          files,
          images,
        });
      } else {
        return await ProductInstaceApi.create({
          name,
          price,
          description,
          category,
          isActive,
          isFeatured,
          store: { id: storeId },
          files,
          images,
        });
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products", { storeId }] });
      toast.success(response.message);
      if (initialData) closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return query;
}

export function useProductMakeFeaturedMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (prodIds: number[]) => {
      return await ProductInstaceApi.markSelecteAsFeatured(prodIds);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

export function useProductDeleteMutation({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const { closeModal } = useModalContext();

  const mutation = useMutation({
    mutationFn: async () => {
      return await ProductInstaceApi.delete(id);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeModal();
    },
  });

  return mutation;
}
