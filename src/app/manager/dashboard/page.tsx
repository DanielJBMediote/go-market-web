"use client";

import { RevenueChartSellers } from "@/components/bar-chart-revenue";
import { DashboardCard } from "@/components/dashboard-card";
import { Loading } from "@/components/ui/loading";
import { useDashboardMetrics } from "@/hooks/stores/queries";
import { Tags, TrendingUp } from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { refetch, data, isFetching } = useDashboardMetrics();

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
      <p className="text-2xl extrabold text-primary">Dashboard - Metrics</p>
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
