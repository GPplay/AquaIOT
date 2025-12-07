'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { getDevices, addAlert } from '@/services/api';
import { connectToMqtt, type MqttMessage } from '@/services/mqtt';
import type { MqttClient } from 'mqtt';
import { useToast } from './use-toast';
import { useAlerts } from './use-alerts';


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
  setSelectedDeviceId: (id: string | undefined) => void;
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
  const { toast } = useToast();
  const { refreshAlerts } = useAlerts();

  const refreshDevices = useCallback(async () => {
    setLoading(true);
    try {
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
        status: 'offline', // Start as offline until a message is received
      }));

      setDevices(formattedDevices);

      // Initialize states for new devices
      setDeviceData(prev => {
        const newState: Record<string, DeviceState> = {...prev};
        for (const device of formattedDevices) {
            if (!newState[device.macAddress]) {
                newState[device.macAddress] = {
                    currentMetrics: { waterLevel: 0, temperature: 0, pressure: 0 },
                    realtimeData: [],
                };
            }
        }
        return newState;
      });

      // Set initial timestamps
      setLastMessageTimestamps(prev => {
        const newTimestamps: Record<string, number> = {...prev};
        for (const device of formattedDevices) {
           if (!newTimestamps[device.macAddress]) {
             newTimestamps[device.macAddress] = 0; // Set to 0 to be considered offline initially
           }
        }
        return newTimestamps;
      });
      
      // Select the first device if none is selected
      if (!selectedDeviceId && formattedDevices.length > 0) {
        setSelectedDeviceIdState(formattedDevices[0].macAddress);
      }


    } catch (err: any) {
      setError(err.message || "No se pudieron cargar los dispositivos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDeviceId]);

  // Initial fetch of devices
  useEffect(() => {
    refreshDevices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MQTT connection and message handling
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const handleNewMqttMessage = async (topic: string, message: MqttMessage) => {
        const deviceId = message.device_id;
        
        // Ensure the device from MQTT exists in our list
        if (!devices.some(d => d.macAddress === deviceId)) return;
        
        // Handle incoming data packets
        if (message.event === 'data' && typeof message.level === 'number' && typeof message.temp === 'number' && typeof message.atm === 'number') {
            setLastMessageTimestamps(prev => ({ ...prev, [deviceId]: Date.now() }));
            
            setDeviceData(prevData => {
                const deviceState = prevData[deviceId] || { currentMetrics: { waterLevel: 0, temperature: 0, pressure: 0 }, realtimeData: [] };
                
                const newMetrics: DeviceMetrics = {
                    waterLevel: message.level,
                    temperature: message.temp,
                    pressure: message.atm,
                };
                
                const newPoint = {
                    ...newMetrics,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                };

                const newRealtimeData = [...deviceState.realtimeData, newPoint].slice(-20);

                return {
                    ...prevData,
                    [deviceId]: {
                        currentMetrics: newMetrics,
                        realtimeData: newRealtimeData,
                    },
                };
            });
        } 
        // Handle incoming alert events
        else if (message.event === 'alert') {
            const { level, data, device_id } = message;

            if ((level === 'HIGH' || level === 'MEDIUM' || level === 'LOW') && data && device_id) {
                try {
                    await addAlert({ device_id, level, description: data });
                    
                    toast({
                        title: `Nueva Alerta de Riesgo: ${level}`,
                        description: `Dispositivo ${device_id}: ${data}`,
                        variant: level === 'HIGH' ? 'destructive' : 'default',
                    });
                    
                    refreshAlerts();

                } catch (error: any) {
                    console.error("Failed to register or notify alert:", error);
                    toast({
                        title: "Error",
                        description: "No se pudo registrar la nueva alerta.",
                        variant: "destructive",
                    });
                }
            }
        }
    };

    const mqttClient: MqttClient = connectToMqtt(userId, handleNewMqttMessage);

    return () => {
        if (mqttClient) {
            mqttClient.end();
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, refreshAlerts, devices]);

  // Offline status checker
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      setDevices(prevDevices => 
        prevDevices.map(device => {
            const lastMessageTime = lastMessageTimestamps[device.macAddress] || 0;
            const isOffline = (now - lastMessageTime > OFFLINE_TIMEOUT);
            const newStatus = isOffline ? 'offline' : 'online';
            if (device.status !== newStatus) {
                return { ...device, status: newStatus };
            }
            return device;
        })
      );
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [lastMessageTimestamps]);


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
