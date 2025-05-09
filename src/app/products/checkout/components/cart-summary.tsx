"use client";

import { API_URL } from "@/api";
import { ICuponApi } from "@/api/CuponApi";
import { IProductApi } from "@/api/ProductApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { CheckoutContextForm, useCheckoutContext } from "@/contexts/checkout-provider";
import { useClientCartContext } from "@/contexts/client-cart-provider";
import { useCuponValidateMutation } from "@/hooks/cupons/mutations";
import { formatCurrency } from "@/utils/math-utils";
import { ImageOff, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export function CartSummary() {
  const { items, removeAllOfItem, addItem, removeItem } = useClientCartContext();
  const { isSubmiting } = useCheckoutContext();

  const { setValue } = useFormContext<CheckoutContextForm>();
  // const { userContext } = useAuthentication();

  const inputRef = useRef<HTMLInputElement>(null);

  const [cupon, setCupon] = useState<ICuponApi | null>(null);
  const [cuponCode, setCuponCode] = useState("");
  const [discount, setDiscount] = useState(cupon ? cupon.percentDiscount : 0);

  const shipping = 0;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalAmount = subtotal + shipping - discount;

  function handleRemoveItem(prodId: number) {
    removeAllOfItem(prodId);
  }

  function handleIncreaseQuantity(product: IProductApi) {
    addItem(product, 1);
  }

  function handleDecreaseQuantity(productId: number) {
    removeItem(productId);
  }

  const { mutateAsync, isPending } = useCuponValidateMutation();

  async function handleApplyCupon() {
    const { data } = await mutateAsync(cuponCode);
    setCupon(data);
    setDiscount(subtotal * (data.percentDiscount / 100));
    setCuponCode("");
  }

  useEffect(() => {
    if (!items.length) return;

    const formattedItems = items.map(({ product, quantity }) => ({ product, quantity }));

    setValue("items", formattedItems);
    setValue("taxes", shipping);
    setValue("discount", discount);
    setValue("totalAmount", totalAmount);
    setValue("cupon", cupon);
  }, [items, discount, totalAmount, setValue, cupon]);

  return (
    <div className="w-full space-y-4 p-6">
      <Text variant="subtitle">Summary</Text>

      <ul className="divide-y">
        {items.length == 0 ? (
          <div className="flex justify-center py-4 item gap-2">
            <ShoppingCart />
            <Text variant="span">Your cart is empty.</Text>
          </div>
        ) : (
          items.map((item) => (
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
                  <span className="text-sm">Quantity: {item.quantity}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-right font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
                <div className="flex gap-2 scale-75 -mr-5">
                  <Button
                    type="button"
                    variant="outline"
                    title="Remove"
                    onClick={() => handleDecreaseQuantity(item.product.id)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    title="Add"
                    onClick={() => handleIncreaseQuantity(item.product)}
                  >
                    <Plus />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    title="Remove"
                    onClick={() => handleRemoveItem(item.product.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </li>
          ))
        )}
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
      {cupon && (
        <div className="flex gap-2 items-center">
          <Text variant="span" color="primary">
            {cupon.cuponCode}
          </Text>
          <Text variant="flag" color="foreground">
            Applied!
          </Text>
        </div>
      )}
      <div className="flex gap-2 pt-4">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Discont Cupon"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          value={cuponCode}
          onChange={(e) => setCuponCode(e.target.value)}
        />
        <Button type="button" onClick={handleApplyCupon} isLoading={isPending}>
          Apply
        </Button>
      </div>
      <Button
        className="w-full"
        size="lg"
        variant="success"
        isLoading={isSubmiting}
        disabled={isSubmiting}
      >
        Checkout
      </Button>
    </div>
  );
}
