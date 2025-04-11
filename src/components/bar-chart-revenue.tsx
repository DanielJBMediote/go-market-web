// src/components/bar-chart-revenue.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/math-utils";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface RevenueChartSellersProps {
  chartData: {
    day: number;
    units: number;
    revenue: number;
  }[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  units: {
    label: "Units Sold",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RevenueChartSellers({ chartData }: RevenueChartSellersProps) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("revenue");

  // Transforma os dados para o formato que o gráfico espera
  const transformedData = chartData.map((item) => ({
    date: new Date(new Date().getFullYear(), new Date().getMonth(), item.day).toISOString(),
    revenue: item.revenue,
    units: item.units,
  }));

  const total = React.useMemo(
    () => ({
      revenue: transformedData.reduce((acc, curr) => acc + curr.revenue, 0),
      units: transformedData.reduce((acc, curr) => acc + curr.units, 0),
    }),
    [transformedData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-2xl">Sales Performance</CardTitle>
          <CardDescription>Daily sales for the current month</CardDescription>
        </div>
        <div className="flex">
          <button
            data-active={activeChart === "revenue"}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 cursor-pointer"
            onClick={() => setActiveChart("revenue")}
          >
            <span className="text-xs text-muted-foreground">{chartConfig.revenue.label}</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {formatCurrency(total.revenue)}
            </span>
          </button>
          <button
            data-active={activeChart === "units"}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 cursor-pointer"
            onClick={() => setActiveChart("units")}
          >
            <span className="text-xs text-muted-foreground">{chartConfig.units.label}</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.units.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={transformedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => {
                    return activeChart === "revenue" ? formatCurrency(Number(value)) : value;
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={chartConfig[activeChart].color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
