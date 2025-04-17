"use client";

import { ProductFilter } from "@/components/product-filters";
import { Loading } from "@/components/ui/loading";
import { Text } from "@/components/ui/text";
import { useProductFilters } from "@/hooks/products/filters";
import { useProductsFeaturedQuery } from "@/hooks/products/queries";
import { useEffect } from "react";
import { AvailableCuponsSections } from "./components/available-cupons-sections";
import { ProductCard } from "./components/products-card";

export default function DashboardPage() {
  const { filters } = useProductFilters();
  const { data: products, refetch, isFetching } = useProductsFeaturedQuery({ filters });

  useEffect(() => {
    refetch();
  }, [refetch, filters]);

  return (
    <div className="flex flex-col gap-4">
      <Text variant="title" color="primary">
        Available products
      </Text>
      <AvailableCuponsSections />
      <ProductFilter.Root>
        <ProductFilter.DescriptionField />
        <ProductFilter.CategoryField />
        <ProductFilter.PriceFields />
      </ProductFilter.Root>
      {isFetching ? (
        <Loading className="h-32" />
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
