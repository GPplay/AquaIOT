'use client';

import { MetricCard } from "@/components/dashboard/metric-card";
import { RealtimeChart } from "@/components/dashboard/realtime-chart";
import { AlertsTable } from "@/components/dashboard/alerts-table";
import { Waves, Thermometer, Gauge, Wifi } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo, useCallback } from "react";
import { connectToMqtt, type DeviceData } from "@/services/mqtt";
import { type MqttClient } from "mqtt";
import { getDevices } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

type Device = {
  id: string; // Internal ID if any, otherwise macAddress can be used
  name: string;
  macAddress: string;
};

type DeviceMetrics = {
    waterLevel: number;
    temperature: number;
    pressure: number;
};

type DeviceState = {
    currentMetrics: DeviceMetrics;
    realtimeData: (DeviceMetrics & { time: string })[];
};

const initialDeviceState: DeviceState = {
    currentMetrics: { waterLevel: 0, temperature: 0, pressure: 0 },
    realtimeData: [],
};

const useMqttData = (devices: Device[]) => {
    const [data, setData] = useState<Record<string, DeviceState>>(() => {
        const initialState: Record<string, DeviceState> = {};
        devices.forEach(device => {
            initialState[device.macAddress] = { ...initialDeviceState };
        });
        return initialState;
    });

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId || devices.length === 0) {
            return;
        }

        const handleNewData = (_topic: string, message: DeviceData) => {
            const deviceId = message.device_id;
            
            if (devices.some(d => d.macAddress === deviceId)) {
                setData(prevData => {
                    const deviceState = prevData[deviceId] || { ...initialDeviceState };
                    const newPoint = {
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        waterLevel: message.level,
                        temperature: message.temp,
                        pressure: message.atm,
                    };
                    const newRealtimeData = [...deviceState.realtimeData, newPoint].slice(-20);

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

        const mqttClient: MqttClient = connectToMqtt(userId, handleNewData);

        return () => {
            if (mqttClient) {
                mqttClient.end();
            }
        };
    }, [devices]);

    return data;
};

export default function DashboardPage() {
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);

  const fetchDevices = useCallback(async () => {
    try {
        const devicesFromApi = await getDevices();
        const formattedDevices: Device[] = devicesFromApi.map((d: any) => ({
          id: d.macAddress,
          name: d.name,
          macAddress: d.macAddress,
        }));
        setDeviceList(formattedDevices);
        if (formattedDevices.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(formattedDevices[0].macAddress);
        }
    } catch (error) {
        console.error("Failed to fetch devices", error);
    } finally {
        setLoadingDevices(false);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const allDevicesData = useMqttData(deviceList);
  const deviceData = (selectedDeviceId && allDevicesData[selectedDeviceId]) || initialDeviceState;
  
  const selectedDevice = useMemo(() => deviceList.find(d => d.id === selectedDeviceId), [selectedDeviceId, deviceList]);

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Panel de Control</h1>
          <p className="text-muted-foreground">Visualización de métricas de dispositivos ESP.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="w-full max-w-xs">
                {loadingDevices ? (
                    <Skeleton className="h-10 w-full" />
                ) : (
                    <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId} disabled={deviceList.length === 0}>
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
        <MetricCard title="Nivel del Agua" value={`${deviceData.currentMetrics.waterLevel.toFixed(2)}m`} icon={<Waves className="h-5 w-5"/>} />
        <MetricCard title="Temperatura" value={`${deviceData.currentMetrics.temperature.toFixed(1)}°C`} icon={<Thermometer className="h-5 w-5"/>} />
        <MetricCard title="Presión Atmosférica" value={`${deviceData.currentMetrics.pressure.toFixed(0)} hPa`} icon={<Gauge className="h-5 w-5"/>} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <RealtimeChart data={deviceData.realtimeData} />
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
