'use client';

import { MetricCard } from "@/components/dashboard/metric-card";
import { WaterLevelChart } from "@/components/dashboard/water-level-chart";
import { RealtimeChart } from "@/components/dashboard/realtime-chart";
import { AlertsTable } from "@/components/dashboard/alerts-table";
import { Waves, Thermometer, Gauge } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { mockWeeklyWaterLevel } from "@/lib/mock-data";
import { connectToMqtt, type DeviceData } from "@/services/mqtt";
import { type MqttClient } from "mqtt";
import { Wifi } from "lucide-react";

type DeviceMetrics = {
    waterLevel: number;
    temperature: number;
    pressure: number;
};

type DeviceState = {
    currentMetrics: DeviceMetrics;
    realtimeData: (DeviceMetrics & { time: string })[];
    weeklyData: { day: string; level: number }[];
};

const initialDeviceState: DeviceState = {
    currentMetrics: { waterLevel: 0, temperature: 0, pressure: 0 },
    realtimeData: [],
    weeklyData: mockWeeklyWaterLevel, // Weekly data can remain mock for now
};

const useMqttData = (devices: { id: string; name: string; macAddress: string }[]) => {
    const [data, setData] = useState<Record<string, DeviceState>>(() => {
        const initialState: Record<string, DeviceState> = {};
        devices.forEach(device => {
            initialState[device.id] = { ...initialDeviceState };
        });
        return initialState;
    });

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID not found. MQTT connection not established.");
            return;
        }

        const handleNewData = (_topic: string, message: DeviceData) => {
            const deviceId = message.device_id;
            
            if (devices.some(d => d.macAddress === deviceId)) {
                // Find our internal ID from the MAC address
                const internalDeviceId = devices.find(d => d.macAddress === deviceId)?.id;
                if (!internalDeviceId) return;

                setData(prevData => {
                    const deviceState = prevData[internalDeviceId] || { ...initialDeviceState };
                    const newPoint = {
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        waterLevel: message.level,
                        temperature: message.temp,
                        pressure: message.atm,
                    };
                    const newRealtimeData = [...deviceState.realtimeData, newPoint].slice(-20);

                    return {
                        ...prevData,
                        [internalDeviceId]: {
                            ...deviceState,
                            currentMetrics: {
                                waterLevel: newPoint.waterLevel,
                                temperature: newPoint.temperature,
                                pressure: newPoint.pressure,
                            },
                            realtimeData: newRealtimeData,
                        },
                    };
                });
            }
        };

        const mqttClient: MqttClient = connectToMqtt(userId, handleNewData);

        return () => {
            if (mqttClient) {
                mqttClient.end();
            }
        };
    }, [devices]);

    return data;
};

const deviceList = [
    { id: 'esp001', name: 'Dispositivo Boca del Río', macAddress: '3C:71:BF:4C:4C:AC' },
    { id: 'esp002', name: 'Dispositivo Canal Getsemaní', macAddress: '84:0D:8E:95:5E:28' },
    { id: 'esp003', name: 'Muelle Bocagrande', macAddress: 'A0:20:A6:10:4E:5A' },
];

export default function DashboardPage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(deviceList[0].id);
  const allDevicesData = useMqttData(deviceList);
  const deviceData = allDevicesData[selectedDeviceId] || initialDeviceState;
  
  const selectedDevice = useMemo(() => deviceList.find(d => d.id === selectedDeviceId), [selectedDeviceId]);

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Panel de Control</h1>
          <p className="text-muted-foreground">Visualización de métricas de dispositivos ESP.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="w-full max-w-xs">
                <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                    <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4"/>
                            <SelectValue placeholder="Seleccionar Dispositivo" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {deviceList.map(device => (
                            <SelectItem key={device.id} value={device.id}>{device.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {selectedDevice && (
              <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded-md">
                ID: {selectedDevice.macAddress}
              </div>
            )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Nivel del Agua" value={`${deviceData.currentMetrics.waterLevel.toFixed(2)}m`} icon={<Waves className="h-5 w-5"/>} />
        <MetricCard title="Temperatura" value={`${deviceData.currentMetrics.temperature.toFixed(1)}°C`} icon={<Thermometer className="h-5 w-5"/>} />
        <MetricCard title="Presión Atmosférica" value={`${deviceData.currentMetrics.pressure.toFixed(0)} hPa`} icon={<Gauge className="h-5 w-5"/>} />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <WaterLevelChart data={deviceData.weeklyData} />
        <RealtimeChart data={deviceData.realtimeData} />
      </div>
      <div>
        <AlertsTable />
      </div>
    </div>
  );
}
