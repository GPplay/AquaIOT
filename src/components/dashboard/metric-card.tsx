import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  variant?: "default" | "destructive";
}

export function MetricCard({ title, value, icon, change, variant = "default" }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn("text-xs text-muted-foreground", { "text-red-500 dark:text-red-400": variant === "destructive" })}>
            {change} desde la última hora
          </p>
        )}
      </CardContent>
    </Card>
  );
}
