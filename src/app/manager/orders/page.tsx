"use client";

import { DataTable } from "@/components/data-table";
import { Loading } from "@/components/ui/loading";
import { Text } from "@/components/ui/text";
import { useOrderFilters } from "@/hooks/orders/filters";
import { useOrdersQuery } from "@/hooks/orders/queries";
import { useEffect } from "react";
import { OrderFilters } from "./components/order-filters";
import { orderColumns } from "./components/table/columns";

export default function OrdersPage() {
  const { filters } = useOrderFilters();

  const { data, refetch, isFetching } = useOrdersQuery({ filters });

  useEffect(() => {
    refetch();
  }, [refetch, filters]);

  return (
    <div className="flex flex-col gap-4">
      <Text variant="title" color="primary">
        Orders
      </Text>
      <OrderFilters />
      {isFetching ? <Loading /> : <DataTable columns={orderColumns} data={data} />}
    </div>
  );
}
