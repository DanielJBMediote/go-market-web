"use client";

import { Button } from "@/components/ui/button";
import { useAuthentication } from "@/contexts/auth-provider";
import { useClientCartContext } from "@/contexts/client-cart-provider";
import { ShoppingBag, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { HeaderMenu } from "./header-menu";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  const { userContext } = useAuthentication();
  const { items } = useClientCartContext();

  return (
    <header className="flex items-center justify-between bg-background shadow px-8 py-4">
      <div className="flex space-x-2 items-center text-primary">
        <ShoppingBag />
        <p className="text-xl font-semibold">Go Market</p>
        {!userContext ? (
          <Skeleton className="h-3 w-40 bg-muted-foreground" />
        ) : (
          userContext && (
            <p className="text-sm text-muted-foreground font-semibold">
              {`- `}Welcome, {userContext.name}!
            </p>
          )
        )}
      </div>
      <div className="space-x-2 flex">
        <Link href="/dashboard">
          <Button className="font-semibold text-md" variant="link">
            Home
          </Button>
        </Link>
        <Button className="font-semibold text-md" variant="link">
          Categories
        </Button>
        <Link href="/stores">
          <Button className="font-semibold text-md" variant="link">
            Stores
          </Button>
        </Link>
        <Link href="/products/checkout">
          <Button className="relative" variant="link" size="icon">
            <p className="absolute -top-2 -right-2 text-primary w-5 h-5 flex items-center justify-center text-xs rounded-full p-0.5">
              {items.length > 9 ? "+9" : items.length}
            </p>
            <ShoppingBasket size={20} />
          </Button>
        </Link>
        <HeaderMenu />
      </div>
    </header>
  );
}
