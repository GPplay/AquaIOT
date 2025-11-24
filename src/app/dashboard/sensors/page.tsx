import { AddSensorDialog } from "@/components/sensors/add-sensor-dialog";
import { SensorsTable } from "@/components/sensors/sensors-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function SensorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Sensor Management</h1>
          <p className="text-muted-foreground">Monitor and manage your flood detection sensors.</p>
        </div>
        <AddSensorDialog>
            <Button>
                <PlusCircle className="mr-2" />
                Add Sensor
            </Button>
        </AddSensorDialog>
      </div>
      <SensorsTable />
    </div>
  );
}
