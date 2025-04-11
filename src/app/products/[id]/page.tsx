"use client";

import { API_URL } from "@/api";
import { IFileApi } from "@/api/FileApi";
import { Button } from "@/components/ui/button";
import { useClientCartContext } from "@/contexts/client-cart-provider";
import { useProductQuery } from "@/hooks/products/queries";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/math-utils";
import { ImageOff, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductComments } from "./comments";
import { SimilarProducSection } from "./similar-product-section";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);

  const { addItem } = useClientCartContext();
  const { refetch, data: product } = useProductQuery({ id: productId });

  const [quantity, setQuantity] = useState<number>(1);
  const [comments, setComments] = useState<Comment[]>([]); // Will be populated via API later

  const [selectedImage, setSelectedImage] = useState<IFileApi | null>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    if (product == null) {
      refetch();
    } else {
      if (product.images.length > 0) setSelectedImage(product.images[0].file);
    }
  }, [refetch, product]);

  if (!product) {
    return <div>Product Unavailable</div>;
  }

  const currentPrice = quantity * product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="container mx-auto">
      {/* Product Name & Description (Top Section) */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-muted-foreground">{product.description}</p>
      </div>

      {/* Product Content (Images + Details) */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Left Column - Product Images */}
        <div className="md:w-1/2 shadow-sm">
          <div className="relative rounded-lg overflow-hidden mb-4 h-96">
            {selectedImage ? (
              <Image
                src={`${API_URL}/files/${selectedImage.uuid}`}
                alt={product.name}
                layout="fill"
                objectFit="contain"
                className="p-4"
              />
            ) : (
              <div className="flex flex-col gap-2 justify-center items-center h-full">
                <ImageOff />
                <p>No image available</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 bg-gray-50 p-4">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.file)}
                className={cn(
                  "relative h-20 w-20 rounded border",
                  selectedImage?.id == img.file.id ? "border-indigo-400" : ""
                )}
              >
                <Image
                  src={`${API_URL}/files/${img.file.uuid}`}
                  alt="Thumbnail"
                  layout="fill"
                  objectFit="cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="md:w-1/2">
          <div className="p-6 rounded-lg space-y-4 h-96">
            <p className="text-foreground font-bold ">{product.description}</p>
            <span className="text-sm text-foreground">Sold by: {product.store.name}</span>
            <div className="-space-y-2">
              {product.highestPrice > product.price && (
                <p className="text-red-400 font-semibold text-lg line-through">
                  {formatCurrency(product.highestPrice)}
                </p>
              )}
              <p className="text-4xl text-primary font-extrabold">{formatCurrency(currentPrice)}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus />
                </Button>
                <span className="px-4 py-1 border-b text-center">{quantity}</span>
                <Button size="icon" variant="secondary" onClick={() => setQuantity(quantity + 1)}>
                  <Plus />
                </Button>
              </div>
              {/* Add to Cart Button */}
              <Button onClick={handleAddToCart}>
                <ShoppingCart />
                Add to Cart
              </Button>
            </div>
            <SimilarProducSection product={product} />
          </div>
        </div>
      </div>

      <ProductComments />
    </div>
  );
}
