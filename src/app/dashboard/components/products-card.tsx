import { IProductApi } from "@/api/ProductApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/math-utils";
import { Heart, ImageOff, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductCardProps {
  product: IProductApi;
}

function FeaturedFlag() {
  return (
    <div className="absolute -top-2 -right-2">
      <div className="absolute -bottom-3 right-1 w-4 h-4 bg-purple-700 transform rotate-45 -z-10" />
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-sm shadow-lg transform rotate-6 z-10">
        FEATURED
      </div>
    </div>
  );
}

export function DiscountFlag({ highestPrice, price }: { highestPrice: number; price: number }) {
  if (!highestPrice || highestPrice <= price) return null;

  const discount = Math.round(((highestPrice - price) / highestPrice) * 100);

  return (
    <div className="absolute top-2 left-0">
      <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-sm shadow-lg z-10">
        -{discount}% OFF
      </div>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  function formatOrderedTimes(times: number) {
    if (times >= 1000) return "+1000";
    if (times >= 500) return "+500";
    return `${times}`;
  }

  const ordereds = formatOrderedTimes(product.timesOrdered);

  return (
    <Card className="relative hover:shadow-lg transition-shadow duration-200">
      {product.isFeatured && <FeaturedFlag />}
      <DiscountFlag highestPrice={product.highestPrice} price={product.price} />

      <CardHeader className="pb-2">
        <CardTitle className="text-lg pt-3 line-clamp-1" title={product.name}>
          {product.name}
        </CardTitle>
        <p className="text-xs text-secondary-foreground">{`${product.category.name} > ${product.category.subName}`}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        {!product.images || product.images.length === 0 ? (
          <div className="flex flex-col gap-4 items-center justify-center text-muted-foreground h-32">
            <ImageOff />
            <p className="text-md font-semibold">No image available</p>
          </div>
        ) : (
          <div className="max-w-xs overflow-x-scroll no-scrollbar flex gap-2">
            {product.images.map((image) => (
              <Image
                key={image.file.uuid}
                src={`${API_URL}/files/${image.file.uuid}`}
                alt={product.name}
                width={128}
                height={128}
                className="w-full h-32 object-contain p-1"
                priority={false}
              />
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <p className="text-primary font-extrabold text-2xl">{formatCurrency(product.price)}</p>
          {product.highestPrice > product.price && (
            <p className="text-red-400 font-semibold text-lg line-through">
              {formatCurrency(product.highestPrice)}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <p className="text-xs font-medium text-accent-foreground">Sold by:</p>
            <p className="text-xs font-medium text-primary">@{product.store.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <Heart className="h-4 w-4 fill-transparent stroke-rose-400" />
          <span>{47}</span>
          {/* <ShoppingCart className="h-4 w-4 text-foreground" />
          <p>{ordereds} sold</p> */}
        </div>
      </CardContent>

      <CardFooter className="gap-2 flex flex-col items-start pt-0">
        <div className="flex gap-2 w-full">
          <Button className="flex-1" asChild>
            <Link href="#">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to cart
            </Link>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/products/${product.id}`}>Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
