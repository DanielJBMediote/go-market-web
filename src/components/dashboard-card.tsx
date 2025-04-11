import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/math-utils";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { ElementType } from "react";

interface DarshboardCardProps {
  title: string;
  value: number;
  valueType?: "currency" | "unit";
  percent: number;
  percentDescription: string;
  icon: ElementType;
}

export function DashboardCard({
  percent,
  value = 0,
  valueType = "currency",
  title,
  percentDescription,
  icon: Icon,
}: DarshboardCardProps) {
  const Arrow = () => {
    return percent > 0 ? (
      <ArrowBigUp fill="#05df72" stroke="transparent" />
    ) : (
      <ArrowBigDown fill="#ff4747" stroke="transparent" />
    );
  };
  return (
    <Card>
      <CardHeader className="flex-row space-x-2 items-center">
        <Icon />
        <CardTitle className="text-foreground text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-extrabold">
          {valueType == "currency" ? formatCurrency(value) : value}
        </p>
        <div className="flex align-baseline items-center gap-1 text-xs">
          <Arrow />
          {percent > 0 ? "+" : ""} {percent}
          {"%"}
          <p className="text-muted-foreground">{percentDescription}</p>
        </div>
      </CardContent>
    </Card>
  );
}
