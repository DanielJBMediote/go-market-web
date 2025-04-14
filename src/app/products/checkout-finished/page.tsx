"use client";

import { IOrderApi } from "@/api/OrderApi";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useClientCartContext } from "@/contexts/client-cart-provider";
import { formatCurrency } from "@/utils/math-utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutFinishedPage() {
  const router = useRouter();
  const { clearCart } = useClientCartContext();

  const [orderDetails, setOrderDetails] = useState<IOrderApi | null>(null);

  useEffect(() => {
    const sessionItem = sessionStorage.getItem("orderDetails");
    if (sessionItem) {
      setOrderDetails(JSON.parse(sessionItem));
    }
  }, []);

  const handleGoHome = () => {
    clearCart(); // Clear the cart after checkout
    router.push("/"); // Redirect to the homepage
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Text variant="title" color="primary" className="mb-4">
        Thank You for Your Purchase!
      </Text>
      <Text variant="paragraph" className="text-center mb-6">
        Your order has been successfully placed. Below are the details of your order.
      </Text>

      {/* Order Details */}
      {orderDetails && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <Text variant="subtitle" className="mb-2">
            Order Summary
          </Text>
          <div className="flex justify-between mb-2">
            <Text variant="span" weight="bold">
              Order ID:
            </Text>
            <Text variant="span">{orderDetails.uuid}</Text>
          </div>
          <div className="flex justify-between mb-2">
            <Text variant="span" weight="bold">
              Total Amount:
            </Text>
            <Text variant="span">{formatCurrency(orderDetails.totalAmount)}</Text>
          </div>
          <div className="flex justify-between mb-2">
            <Text variant="span" weight="bold">
              Payment Method:
            </Text>
            <Text variant="span">{orderDetails.paymentMethod}</Text>
          </div>
          <div className="flex justify-between">
            <Text variant="span" weight="bold">
              Delivery Date:
            </Text>
            {orderDetails.deliveryDate ? (
              <Text variant="span">{new Date(orderDetails.deliveryDate).toLocaleDateString()}</Text>
            ) : (
              <Text variant="span">--</Text>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button className="mt-6" onClick={handleGoHome}>
        Go to Homepage
      </Button>
    </div>
  );
}
