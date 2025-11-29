import { MetricCard } from "@/components/dashboard/metric-card";
import { WaterLevelChart } from "@/components/dashboard/water-level-chart";
import { RainfallChart } from "@/components/dashboard/rainfall-chart";
import { AlertsTable } from "@/components/dashboard/alerts-table";
import { Droplet, Waves, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Nivel Actual del Agua" value="2.5m" icon={<Waves className="h-5 w-5"/>} change="+5.2%" />
        <MetricCard title="Precipitación (24h)" value="15mm" icon={<Droplet className="h-5 w-5"/>} change="-2.1%" />
        <MetricCard title="Alertas Activas" value="3" icon={<AlertTriangle className="h-5 w-5"/>} change="+1" variant="destructive" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <WaterLevelChart />
        <RainfallChart />
      </div>
      <div>
        <AlertsTable />
      </div>
    </div>
  );
}
