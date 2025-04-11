"use client";

import { IStoreApi, StoreInstanceApi } from "@/api/StoreApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useModal } from "@/contexts/modal-provider";
import { useStoreRevenue } from "@/hooks/stores/store-revenue-hook";
import { formatCurrency } from "@/utils/math-utils";
import { ChartNoAxesCombined, ExternalLink, Pencil, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StoreFormModal } from "./store-form-modal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface StoreCardProp {
  store: IStoreApi;
}

export function StoreCard({ store }: StoreCardProp) {
  const { avarageSalles, totalOrdered, totalSalles } = useStoreRevenue(store.products || []);
  const { openModal } = useModal();

  async function handleEditStore() {
    const { data } = await StoreInstanceApi.fetchOneById(store.id);
    openModal(<StoreFormModal initialData={data} />);
  }

  // const productsLength = store.products.length;
  const productsLength = 0;

  return (
    <Card className="relative p-0">
      {store.logo ? (
        <div className="w-full h-56 overflow-hidden rounded-lg shadow-lg">
          <Image
            src={`${API_URL}/files/${store.logo.uuid}`}
            alt={"Logo image of " + store.name + " store."}
            width={420}
            height={100}
            className="w-full h-full object-cover object-bottom"
          />
        </div>
      ) : (
        <div className="h-56 w-full flex items-center justify-center gap-2">
          <Store />
          No Image.
        </div>
      )}
      <CardHeader className="flex-row space-x-2 items-center">
        <CardTitle className="text-foreground text-xl flex items-center gap-2">
          <Store />
          {store.name}
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-foreground">{store.description}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-center">
            <p className="text-md font-semibold">Avarage Salles:</p>
            <p className="font-light text-sm">{formatCurrency(avarageSalles)}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-md font-semibold">Total Ordered:</p>
            <p className="font-light text-sm">{totalOrdered}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-md font-semibold">Total Salles:</p>
            <p className="font-light text-sm">{formatCurrency(totalSalles)}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-md font-semibold">Products:</p>
            <p className="font-light text-sm">{productsLength}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-md font-semibold">Status:</p>
            {store.isActive ? (
              <div className="flex items-center gap-1">
                <div className="bg-green-400 w-2 h-2 rounded-full" />
                <p className="font-light">Active</p>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="bg-rose-400 w-2 h-2 rounded-full" />
                <p className="font-light">Inactive</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-md font-semibold">Create at:</p>
            <p className="font-light text-sm">{new Date(store.createdAt).toDateString()}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-md font-semibold">Owner:</p>
            <p className="font-light text-sm">{store.owner.name}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center absolute top-[40%] right-2">
          <Button variant="outline" onClick={handleEditStore}>
            Edit
            <Pencil />
          </Button>
          <Link href={`/manager/stores/${store.id}/products`}>
            <Button variant="outline">
              See Products
              <ExternalLink />
            </Button>
          </Link>
          <Link href={`/manager/stores/${store.id}/dashboard`}>
            <Button variant="outline">
              Dashboard
              <ChartNoAxesCombined />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
