import { AddSensorDialog } from "@/components/sensors/add-sensor-dialog";
import { SensorsTable } from "@/components/sensors/sensors-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function SensorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Gestión de Dispositivos ESP</h1>
          <p className="text-muted-foreground">Monitorea y administra tus dispositivos de detección de inundaciones.</p>
        </div>
        <AddSensorDialog>
            <Button>
                <PlusCircle className="mr-2" />
                Añadir Dispositivo
            </Button>
        </AddSensorDialog>
      </div>
      <SensorsTable />
    </div>
  );
}
