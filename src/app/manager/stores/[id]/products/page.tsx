"use client";

import { API_URL } from "@/api";
import { IProductApi } from "@/api/ProductApi";
import { DataTable } from "@/components/data-table";
import { ProductFilter } from "@/components/product-filters";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Skeleton } from "@/components/ui/skeleton";
import { useModalContext } from "@/contexts/modal-provider";
import { useProductFilters } from "@/hooks/products/filters";
import { useProductMakeFeaturedMutation } from "@/hooks/products/mutations";
import { useProductByStoreIdQuery } from "@/hooks/products/queries";
import { useStoreQuery } from "@/hooks/stores/queries";
import { Star, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductFormModal } from "./components/product-modal-form";
import { columns } from "./components/table/columns";

export default function StoreProductsPage() {
  const { id } = useParams();
  const storeId = Number(id);
  const { openModal } = useModalContext();

  const { filters } = useProductFilters((state) => state);
  const { data: products, refetch, isFetching } = useProductByStoreIdQuery({ storeId, filters });
  const {
    data: store,
    refetch: refetchStore,
    isFetching: isFetchingStore,
  } = useStoreQuery({ id: storeId });

  const [selectedProducts, setSelectedProducts] = useState<IProductApi[]>([]);

  useEffect(() => {
    if (store == null) {
      refetchStore();
    }
  }, [store, refetchStore]);

  useEffect(() => {
    refetch();
  }, [refetch, filters]);

  function handleCreateProduct() {
    openModal(<ProductFormModal />);
  }

  const { mutateAsync } = useProductMakeFeaturedMutation();

  const isFeatureBtnDisabled =
    selectedProducts.length > 0 && selectedProducts.some((p) => !p.isFeatured);

  const isInactiveBtnDisabled =
    selectedProducts.length > 0 && selectedProducts.some((p) => p.isActive);

  async function handleMakeFeaturedSelect() {
    const prodIds = selectedProducts.map((p) => p.id);
    await mutateAsync(prodIds);
  }

  async function handleActiveInactiveSelected() {}

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        {!store || isFetchingStore ? (
          <Skeleton className="w-32 h-5" />
        ) : (
          <div className="flex items-center gap-2">
            {store.logo && (
              <Image
                src={`${API_URL}/files/${store.logo.uuid}`}
                alt=""
                width={128}
                height={128}
                className="w-20 h-20"
              />
            )}
            <div className="flex flex-col">
              <p className="text-2xl font-semibold text-foreground">{store.name}</p>
              <p className="text-xl font-light text-muted-foreground">{store.description}</p>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleMakeFeaturedSelect}
            disabled={!isFeatureBtnDisabled}
          >
            <Star />
            Mark as featured
          </Button>
          <Button variant="outline" disabled={!isInactiveBtnDisabled}>
            <X />
            Inactive {selectedProducts.length} items
          </Button>
          <Button onClick={handleCreateProduct}>Add Product</Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <ProductFilter.Root>
          <ProductFilter.DescriptionField />
          <ProductFilter.CategoryField />
          <ProductFilter.StatusField />
          <ProductFilter.PriceFields />
        </ProductFilter.Root>
        {isFetching ? (
          <Loading size="large" className="h-[200px]" />
        ) : (
          <DataTable
            data={products}
            columns={columns}
            onRowSelectionChange={setSelectedProducts}
            pagination={{
              itemsPerPageOptions: [1, 5, 10, 20],
            }}
          />
        )}
      </div>
    </div>
  );
}
