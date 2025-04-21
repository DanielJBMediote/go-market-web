"use client";

import { DataTable } from "@/components/data-table";
import { Text } from "@/components/ui/text";
import { useCuponsQuery } from "@/hooks/cupons/queries";
import { useEffect } from "react";
import { columns } from "./components/table/columns";

export default function CuponsPage() {
  const { refetch, data: cupons } = useCuponsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col gap-2">
      <Text variant="title" color="primary">
        Cupons
      </Text>
      <DataTable data={cupons} columns={columns} />
    </div>
  );
}
