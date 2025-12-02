'use client';

import { MetricCard } from "@/components/dashboard/metric-card";
import { WaterLevelChart } from "@/components/dashboard/water-level-chart";
import { RealtimeChart } from "@/components/dashboard/realtime-chart";
import { AlertsTable } from "@/components/dashboard/alerts-table";
import { Waves, Thermometer, Gauge, AlertTriangle, Wifi, Bot } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { mockDeviceData, mockWeeklyWaterLevel } from "@/lib/mock-data";
import { RiskAssessmentForm } from "@/components/dashboard/risk-assessment-form";
import { connectToMqtt, type DeviceData } from "@/services/mqtt";
import { type MqttClient } from "mqtt";


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

const useMqttData = (devices: string[]) => {
    const [data, setData] = useState<Record<string, DeviceState>>(() => {
        const initialState: Record<string, DeviceState> = {};
        devices.forEach(deviceId => {
            // Initialize with mock data structure to avoid undefined errors
            initialState[deviceId] = {
                currentMetrics: mockDeviceData[deviceId]?.currentMetrics || { waterLevel: 0, temperature: 0, pressure: 0 },
                realtimeData: mockDeviceData[deviceId]?.realtimeData || [],
                weeklyData: mockWeeklyWaterLevel,
            };
        });
        return initialState;
    });

    useEffect(() => {
        const handleNewData = (topic: string, message: DeviceData) => {
            const topicParts = topic.split('/');
            const deviceId = topicParts[2]; // e.g., 'devices/esp/esp001/data' -> 'esp001'

            if (devices.includes(deviceId)) {
                setData(prevData => {
                    const deviceState = prevData[deviceId] || initialDeviceState;
                    const newPoint = {
                        time: new Date().toLocaleTimeString(),
                        waterLevel: message.waterLevel,
                        temperature: message.temperature,
                        pressure: message.pressure,
                    };
                    const newRealtimeData = [...deviceState.realtimeData, newPoint].slice(-20); // Keep last 20 points

                    return {
                        ...prevData,
                        [deviceId]: {
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

        const mqttClient: MqttClient = connectToMqtt(handleNewData);

        // Cleanup on component unmount
        return () => {
            if (mqttClient) {
                mqttClient.end();
            }
        };
    }, [devices]); // Re-run effect if device list changes

    return data;
};

const deviceList = [
    { id: 'esp001', name: 'Dispositivo Boca del Río' },
    { id: 'esp002', name: 'Dispositivo Canal Getsemaní' },
    { id: 'esp003', name: 'Muelle Bocagrande' },
];
const deviceIds = deviceList.map(d => d.id);

export default function DashboardPage() {
  const [selectedDevice, setSelectedDevice] = useState(deviceIds[0]);
  const allDevicesData = useMqttData(deviceIds);
  const deviceData = allDevicesData[selectedDevice] || initialDeviceState;

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Panel de Control</h1>
          <p className="text-muted-foreground">Visualización de métricas de dispositivos ESP.</p>
        </div>
        <div className="w-full max-w-xs">
            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
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
