"use client";

import { API_URL } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuthentication } from "@/contexts/auth-provider";
import { CheckoutContextForm } from "@/contexts/checkout-provider";
import { useClientCartContext } from "@/contexts/client-cart-provider";
import { formatCurrency } from "@/utils/math-utils";
import { ImageOff, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export function CartSummary() {
  const { items, removeAllOfItem } = useClientCartContext();

  const { setValue } = useFormContext<CheckoutContextForm>();
  const { userContext } = useAuthentication();

  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");

  const shipping = 0;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalAmount = subtotal + shipping - discount;

  function handleRemoveItem(prodId: number) {
    removeAllOfItem(prodId);
  }

  useEffect(() => {
    if (!items.length) return;

    const formattedItems = items.map(({ product, quantity }) => ({ product, quantity }));

    setValue("items", formattedItems);
    setValue("taxes", shipping);
    setValue("discount", discount);
    setValue("totalAmount", totalAmount);
  }, [items, discount, totalAmount, setValue]);

  return (
    <div className="w-full space-y-4 p-6">
      <h2 className="text-xl font-semibold border-b pb-2">Summary</h2>

      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.product.id} className="flex justify-between py-3">
            <div className="flex gap-3">
              {item.product.images.length > 0 ? (
                <Image
                  src={`${API_URL}/files/${item.product.images[0].file.uuid}`}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded"
                  width={128}
                  height={128}
                />
              ) : (
                <div className="flex flex-col justify-center text-center items-center w-24 border p-2">
                  <ImageOff />
                  <Text variant="span">No image available</Text>
                </div>
              )}
              <div className="flex flex-col text-foreground">
                <span className="font-semibold">{item.product.name}</span>
                <span className="text-xs">Qt.: {item.quantity}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveItem(item.product.id)}
                >
                  <Trash />
                  Remove
                </Button>
              </div>
            </div>
            <p className="text-right font-medium">
              {formatCurrency(item.product.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discont</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="border-t pt-2 flex justify-between text-base text-foreground font-bold">
          <span>Total</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Input
          type="text"
          placeholder="Discont Cupon"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          // value={coupon}
          // onChange={e => setCoupon(e.target.value)}
        />
        <Button
          type="button"
          // onClick={applyCoupon}
        >
          Aplicar
        </Button>
      </div>
      <Button className="w-full" size="lg" variant="success">
        Checkout
      </Button>
    </div>
  );
}
