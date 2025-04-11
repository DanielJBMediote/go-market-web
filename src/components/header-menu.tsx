import { Roles } from "@/api/UserApi";
import { useAuthentication } from "@/contexts/auth-provider";
import { getUrlPath } from "@/utils/path-utils";
import {
  CreditCard,
  Heart,
  MapPin,
  Megaphone,
  MenuIcon,
  MessageCircleQuestion,
  Newspaper,
  Package2,
  PackageOpen,
  ShoppingCart,
  Star,
  Store,
  Ticket,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export function HeaderMenu() {
  const { userContext, logout } = useAuthentication();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="link">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-6 w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>
            {!userContext ? (
              <Skeleton className="w-32 h-4 bg-muted-foreground" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="rounded-full w-10 h-10 bg-gray-400 shadow" />
                <div className="flex flex-col gap-0.5">
                  <p className="font-bold text-foreground">{userContext.name}</p>
                  <p className="font-light text-foreground text-sm">{userContext.email}</p>
                </div>
              </div>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Package2 />
            Orders
          </DropdownMenuItem>
          {userContext && userContext.role == Roles.MANAGER ? (
            <Link href={getUrlPath(userContext.role).concat("/stores")}>
              <DropdownMenuItem className="cursor-pointer">
                <Store />
                My stores
              </DropdownMenuItem>
            </Link>
          ) : (
            <>
              <DropdownMenuItem className="cursor-pointer">
                <MapPin />
                Addresses
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard />
                Payments
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-1.5 -ml-0.5">
              <ShoppingCart size={18} className="text-muted-foreground" /> Products
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-52 cursor-pointer">
              <DropdownMenuItem className="cursor-pointer">
                <Ticket /> Offers
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Newspaper /> Whats new?
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Star /> Best Sellers
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <PackageOpen /> Categories
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem className="cursor-pointer">
            <Heart /> Whishlist
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <MessageCircleQuestion /> Customer Service
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Megaphone /> Promotions
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Trophy /> Loyality Program
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-rose-400" onClick={logout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
