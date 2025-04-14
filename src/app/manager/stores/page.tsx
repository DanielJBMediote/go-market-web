"use client";

import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { useAuthentication } from "@/contexts/auth-provider";
import { useModalContext } from "@/contexts/modal-provider";
import { useStoreFilters } from "@/hooks/stores/filters";
import { useStoresQuery } from "@/hooks/stores/queries";
import { ChartLine, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { StoreCard } from "./components/card-detail";
import { StoreFormModal } from "./components/store-form-modal";

export default function StoresPage() {
  const { openModal } = useModalContext();
  const { userContext } = useAuthentication();

  const { filters, setFilter } = useStoreFilters();

  const { refetch, data: stores, isFetching } = useStoresQuery({ filters });

  useEffect(() => {
    if (userContext) {
      setFilter("owner.id", userContext.id, "EQUALS");
    }
  }, [userContext, setFilter]);

  useEffect(() => {
    console.log("Filtros atuais:", filters);
    refetch();
  }, [filters, refetch]);

  function handleCreateStore() {
    openModal(<StoreFormModal />);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button onClick={handleCreateStore}>
          <Plus />
          New Store
        </Button>
        <Link href="/manager/dashboard">
          <Button>
            <ChartLine />
            See Overhall
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center pb-2 mb-4">
          <p className="text-2xl font-bold text-foreground">My Stores</p>
          <p className="text-md font-light text-foreground">{stores.length} stores</p>
        </div>
        {isFetching ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
