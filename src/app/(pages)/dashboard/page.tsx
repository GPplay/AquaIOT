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

// Mock data fetching, replace with your actual data fetching logic (e.g., from MQTT service)
const useDeviceData = (deviceId: string) => {
  const [data, setData] = useState({
    waterLevel: 0,
    temperature: 0,
    pressure: 0,
    realtimeData: [],
    weeklyData: [],
  });

  useEffect(() => {
    // Initial data load
    setData({
        waterLevel: mockDeviceData[deviceId]?.currentMetrics.waterLevel || 0,
        temperature: mockDeviceData[deviceId]?.currentMetrics.temperature || 0,
        pressure: mockDeviceData[deviceId]?.currentMetrics.pressure || 0,
        realtimeData: mockDeviceData[deviceId]?.realtimeData || [],
        weeklyData: mockWeeklyWaterLevel
    });

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      setData(prevData => {
        const newRealtimePoint = {
          time: new Date().toLocaleTimeString(),
          waterLevel: parseFloat((prevData.waterLevel + (Math.random() - 0.5) * 0.1).toFixed(2)),
          temperature: parseFloat((prevData.temperature + (Math.random() - 0.5) * 0.2).toFixed(2)),
          pressure: parseFloat((prevData.pressure + (Math.random() - 0.5) * 5).toFixed(2)),
        };

        const newRealtimeData = [...prevData.realtimeData, newRealtimePoint].slice(-20); // Keep last 20 points

        return {
          ...prevData,
          waterLevel: newRealtimePoint.waterLevel,
          temperature: newRealtimePoint.temperature,
          pressure: newRealtimePoint.pressure,
          realtimeData: newRealtimeData,
        };
      });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [deviceId]);

  return data;
};


export default function DashboardPage() {
  const [selectedDevice, setSelectedDevice] = useState('esp001');
  const deviceData = useDeviceData(selectedDevice);

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
                    <SelectItem value="esp001">Dispositivo Boca del Río</SelectItem>
                    <SelectItem value="esp002">Dispositivo Canal Getsemaní</SelectItem>
                    <SelectItem value="esp003">Muelle Bocagrande</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Nivel del Agua" value={`${deviceData.waterLevel.toFixed(2)}m`} icon={<Waves className="h-5 w-5"/>} />
        <MetricCard title="Temperatura" value={`${deviceData.temperature.toFixed(1)}°C`} icon={<Thermometer className="h-5 w-5"/>} />
        <MetricCard title="Presión Atmosférica" value={`${deviceData.pressure.toFixed(0)} hPa`} icon={<Gauge className="h-5 w-5"/>} />
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
