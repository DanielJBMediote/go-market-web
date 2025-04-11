"use client";

import { API_URL } from "@/api";
import { RevenueChartSellers } from "@/components/bar-chart-revenue";
import { Loading } from "@/components/ui/loading";
import { useDashboardMetricsByStoreId } from "@/hooks/stores/queries";
import { Tags, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { DashboardCard } from "../../../../../components/dashboard-card";

export default function Dashboard() {
  const { id } = useParams();
  const storeId = Number(id);

  const { refetch: refetch, data, isFetching } = useDashboardMetricsByStoreId({ id: storeId });

  useEffect(() => {
    if (data == null) {
      refetch();
    }
  }, [data, refetch]);

  if (isFetching) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        {data.store.logo && (
          <Image
            src={`${API_URL}/files/${data.store.logo.uuid}`}
            alt=""
            width={128}
            height={128}
            className="h-16 w-16 object-contain"
            priority={false}
          />
        )}
        <div className="flex flex-col">
          <p className="text-2xl font-semibold text-accent-foreground">{data.store.name}</p>
          <p className="text-xl font-medium text-muted-foreground">{data.store.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <DashboardCard
          title="Sales Performance"
          value={data.monthlyRevenue}
          percent={data.diffMonthlyRevenuePercent}
          icon={TrendingUp}
          percentDescription="since last month"
        />
        <DashboardCard
          title="Total Sales"
          value={data.monthlySales}
          valueType="unit"
          percent={data.diffMonthlySalesPercent}
          icon={Tags}
          percentDescription="since last month"
        />
        <DashboardCard
          title="Daily Sales"
          value={data.dailySales}
          valueType="unit"
          percent={data.diffDailySalesPercent}
          icon={Tags}
          percentDescription="since last day"
        />
        <DashboardCard
          title="Average Sales"
          value={data.averageDaily}
          percent={data.diffDailyAvarageSalesPercent}
          icon={TrendingUp}
          percentDescription="since last month"
        />
      </div>

      <RevenueChartSellers chartData={data.dataChart} />
    </div>
  );
}
