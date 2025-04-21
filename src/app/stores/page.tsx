"use client";

import { API_URL } from "@/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Text } from "@/components/ui/text";
import { useStoresQuery } from "@/hooks/stores/queries";
import { Store } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function StoresPage() {
  const { refetch, data: stores, isFetching } = useStoresQuery({ filters: [] });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col gap-2">
      <Text variant="title" color="primary">
        Stores
      </Text>
      {isFetching ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card className="relative p-0" key={store.id}>
              {store.logo ? (
                <div className="w-full h-64 overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={`${API_URL}/files/${store.logo.uuid}`}
                    alt={"Logo image of " + store.name + " store."}
                    width={420}
                    height={100}
                    className="w-full h-full object-cover object-bottom"
                  />
                </div>
              ) : (
                <div className="h-64 w-full flex items-center justify-center gap-2">
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
              <CardContent className="pb-4 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex gap-2 items-center">
                    <p className="text-md font-semibold">Create at:</p>
                    <p className="font-light text-sm">{new Date(store.createdAt).toDateString()}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-md font-semibold">Owner:</p>
                    <p className="font-light text-sm">{store.owner.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
