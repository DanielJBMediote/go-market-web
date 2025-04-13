"use client";

import { DataTable } from "@/components/data-table";
import { Text } from "@/components/ui/text";
import { useOrdersQuery } from "@/hooks/orders/queries";
import { useEffect } from "react";
import { orderColumns } from "./components/columns";

export default function OrdersPage() {
  const { data, refetch } = useOrdersQuery({ filters: [] });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col gap-4">
      <Text variant="title">Orders</Text>
      <DataTable columns={orderColumns} data={data} />
    </div>
  );
}
