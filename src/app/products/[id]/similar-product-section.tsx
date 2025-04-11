import { API_URL } from "@/api";
import { IProductApi } from "@/api/ProductApi";
import { Filter } from "@/hooks/handle-filter";
import { ProductKeys } from "@/hooks/products/filters";
import { useProductsQuery } from "@/hooks/products/queries";
import { formatCurrency } from "@/utils/math-utils";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SimilarProductSectionProps {
  product: IProductApi;
}

export function SimilarProducSection({ product }: SimilarProductSectionProps) {
  const filters: Filter<ProductKeys>[] = [
    { key: "category.id", value: product.category.id, operator: "EQUALS" },
  ];

  const { data } = useProductsQuery({ filters });

  if (data.length == 0) {
    return <div className="text-sm text-muted-foreground">No similar products available.</div>;
  }

  return (
    <div className="space-y-2">
      <p>Similar of {product.name}:</p>
      <div className="flex no-scrollable overflow-x-hidden max-w-full gap-4">
        {data.map((smProd) => (
          <div
            key={`similar-${smProd.id}`}
            className="w-56 h-64 p-4 bg-card rounded shadow-sm border flex flex-col justify-between"
          >
            <span className="text-sm text-foreground">{smProd.name}</span>
            {smProd.images && smProd.images.length > 0 ? (
              <Image
                src={`${API_URL}/files/${smProd.images[0].file.uuid}`}
                alt={product.name}
                objectFit="contain"
                className="p-4"
                width={128}
                height={128}
              />
            ) : (
              <div className="flex flex-col gap-2 justify-center items-center h-full">
                <ImageOff />
                <p>No image available</p>
              </div>
            )}
            <span className="font-bold text-primary text-xl">{formatCurrency(smProd.price)}</span>
            <span className="text-sm flex gap-2 items-center font-bold">
              Sold by:
              <Link href={`/stores/${smProd.store.id}/about`}>
                <p className="text-indigo-400">@{smProd.store.name}</p>
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
