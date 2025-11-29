import { AlertsTable } from "@/components/dashboard/alerts-table";

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Historial de Alertas</h1>
          <p className="text-muted-foreground">Navega a través de todas las alertas de riesgo de inundación pasadas.</p>
        </div>
      </div>
      <AlertsTable />
    </div>
  );
}
