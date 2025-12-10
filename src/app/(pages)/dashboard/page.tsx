'use client';

import { MetricCard } from "@/components/dashboard/metric-card";
import { RealtimeChart } from "@/components/dashboard/realtime-chart";
import { AlertsTable } from "@/components/dashboard/alerts-table";
import { Waves, Thermometer, Gauge, Wifi } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDevices } from "@/hooks/use-devices";

export default function DashboardPage() {
  const { 
    devices, 
    loading, 
    selectedDevice, 
    setSelectedDeviceId,
    deviceData,
  } = useDevices();

  const currentDeviceData = deviceData[selectedDevice?.macAddress || ''] || { currentMetrics: { waterLevel: 0, temperature: 0, pressure: 0 }, realtimeData: [] };
  
  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Panel de Control</h1>
          <p className="text-muted-foreground">Visualización de métricas de dispositivos ESP.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="w-full max-w-xs">
                {loading ? (
                    <Skeleton className="h-10 w-full" />
                ) : (
                    <Select value={selectedDevice?.macAddress} onValueChange={setSelectedDeviceId} disabled={devices.length === 0}>
                        <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                <Wifi className="h-4 w-4"/>
                                <SelectValue placeholder="Seleccionar Dispositivo" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {devices.map(device => (
                                <SelectItem key={device.macAddress} value={device.macAddress}>{device.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
            {selectedDevice && (
              <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded-md">
                ID: {selectedDevice.macAddress}
              </div>
            )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Nivel del Agua" value={`${currentDeviceData.currentMetrics.waterLevel.toFixed(2)} cm`} icon={<Waves className="h-5 w-5"/>} />
        <MetricCard title="Temperatura" value={`${currentDeviceData.currentMetrics.temperature.toFixed(1)}°C`} icon={<Thermometer className="h-5 w-5"/>} />
        <MetricCard title="Presión Atmosférica" value={`${currentDeviceData.currentMetrics.pressure.toFixed(0)} hPa`} icon={<Gauge className="h-5 w-5"/>} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <RealtimeChart data={currentDeviceData.realtimeData} />
      </div>
      <div>
        <AlertsTable 
            filterByDeviceId={selectedDevice?.macAddress}
            title={`Alertas para ${selectedDevice?.name || 'el dispositivo seleccionado'}`}
            description="Alertas de riesgo de inundación recientes para el dispositivo seleccionado."
        />
      </div>
    </div>
  );
}
