'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { getDevices } from '@/services/api';
import { connectToMqtt, type DeviceData } from '@/services/mqtt';
import type { MqttClient } from 'mqtt';

export type Device = {
  macAddress: string;
  name: string;
  address: string;
  status: 'online' | 'offline';
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

interface DevicesContextType {
  devices: Device[];
  loading: boolean;
  error: string | null;
  selectedDevice: Device | undefined;
  setSelectedDeviceId: (id: string) => void;
  deviceData: Record<string, DeviceState>;
  refreshDevices: () => void;
}

const DevicesContext = createContext<DevicesContextType | undefined>(undefined);

// Timeout in milliseconds to consider a device offline
const OFFLINE_TIMEOUT = 30000;

export function DevicesProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceIdState] = useState<string | undefined>();
  const [lastMessageTimestamps, setLastMessageTimestamps] = useState<Record<string, number>>({});
  
  const [deviceData, setDeviceData] = useState<Record<string, DeviceState>>({});

  const refreshDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const devicesFromApi = await getDevices();
      
      const testDeviceItem = localStorage.getItem('testDevice');
      if (testDeviceItem) {
          const testDevice = JSON.parse(testDeviceItem);
          if (!devicesFromApi.some((d: any) => d.id === testDevice.id)) {
              devicesFromApi.push(testDevice);
          }
      }

      const formattedDevices: Device[] = devicesFromApi.map((d: any) => ({
        macAddress: d.id,
        name: d.name,
        address: d.address,
        status: d.status === 'ON' ? 'online' : 'offline',
      }));

      setDevices(formattedDevices);

      if (formattedDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceIdState(formattedDevices[0].macAddress);
      }
      
      // Initialize states
      setDeviceData(prev => {
        const newState: Record<string, DeviceState> = {};
        for (const device of formattedDevices) {
            newState[device.macAddress] = prev[device.macAddress] || {
                currentMetrics: { waterLevel: 0, temperature: 0, pressure: 0 },
                realtimeData: [],
            };
        }
        return newState;
      });

      setLastMessageTimestamps(prev => {
        const newTimestamps: Record<string, number> = {};
        for (const device of formattedDevices) {
            newTimestamps[device.macAddress] = prev[device.macAddress] || Date.now();
        }
        return newTimestamps;
      });


    } catch (err: any) {
      setError(err.message || "No se pudieron cargar los dispositivos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  // MQTT connection
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const handleNewData = (_topic: string, message: DeviceData) => {
        const deviceId = message.device_id;
        
        setDevices(prevDevices => prevDevices.map(d => d.macAddress === deviceId ? { ...d, status: 'online' } : d));
        setLastMessageTimestamps(prev => ({...prev, [deviceId]: Date.now()}));
        
        setDeviceData(prevData => {
            const deviceState = prevData[deviceId] || { currentMetrics: { waterLevel: 0, temperature: 0, pressure: 0 }, realtimeData: [] };
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
    };

    const mqttClient: MqttClient = connectToMqtt(userId, handleNewData);

    return () => {
        if (mqttClient) {
            mqttClient.end();
        }
    };
  }, []);

  // Offline status checker
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const updatedDevices = devices.map(device => {
        const lastMessageTime = lastMessageTimestamps[device.macAddress];
        const isOffline = lastMessageTime ? (now - lastMessageTime > OFFLINE_TIMEOUT) : true;
        return { ...device, status: isOffline ? 'offline' : 'online' };
      });
      setDevices(updatedDevices);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [devices, lastMessageTimestamps]);


  const selectedDevice = useMemo(() => devices.find(d => d.macAddress === selectedDeviceId), [devices, selectedDeviceId]);

  const value = {
    devices,
    loading,
    error,
    selectedDevice,
    setSelectedDeviceId: setSelectedDeviceIdState,
    deviceData,
    refreshDevices,
  };

  return <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>;
}

export function useDevices(): DevicesContextType {
  const context = useContext(DevicesContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DevicesProvider');
  }
  return context;
}
