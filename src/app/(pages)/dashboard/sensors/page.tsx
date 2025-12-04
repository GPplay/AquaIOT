'use client';

import { AddSensorDialog } from "@/components/sensors/add-sensor-dialog";
import { SensorsTable } from "@/components/sensors/sensors-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useCallback } from "react";

export default function SensorsPage() {
  // Dummy state and function to pass to SensorsTable.
  // The actual device list is managed inside DashboardPage for the dropdown.
  // This could be lifted to a shared context if needed across more pages.
  const [devices, setDevices] = useState<any[]>([]);
  const handleDevicesLoaded = useCallback((loadedDevices: any[]) => {
    setDevices(loadedDevices);
  }, []);

  const [refreshKey, setRefreshKey] = useState(0);
  const handleDeviceAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Gestión de Dispositivos ESP</h1>
          <p className="text-muted-foreground">Monitorea y administra tus dispositivos de detección de inundaciones.</p>
        </div>
        <AddSensorDialog onDeviceAdded={handleDeviceAdded}>
            <Button>
                <PlusCircle className="mr-2" />
                Añadir Dispositivo
            </Button>
        </AddSensorDialog>
      </div>
      <SensorsTable key={refreshKey} onDevicesLoaded={handleDevicesLoaded} />
    </div>
  );
}
