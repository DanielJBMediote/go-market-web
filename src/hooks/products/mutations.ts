import { IProductApi, ProductInstaceApi } from "@/api/ProductApi";
import { ProductTypeSchema } from "@/app/manager/stores/[id]/products/components/product-modal-form";
import { useModal } from "@/contexts/modal-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateProductMutationProps {
  storeId: number;
  initialData?: IProductApi;
}

export function useProductMutation({ storeId, initialData }: CreateProductMutationProps) {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", { storeId }] });
      toast.success(`Product ${initialData ? "updated" : "created"} successfully!`);
      if (initialData) {
        closeModal();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return query;
}
