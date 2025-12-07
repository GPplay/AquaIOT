'use client';

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode, useCallback } from 'react';
import { getAlerts } from '@/services/api';
import { type Alert } from '@/lib/types';

interface AlertsContextType {
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  loading: boolean;
  error: string | null;
  unreadCount: number;
  refreshAlerts: () => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAlerts = await getAlerts();
      setAlerts(fetchedAlerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar las alertas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAlerts();
    
    // Periodically refresh alerts
    const intervalId = setInterval(refreshAlerts, 30000); // every 30 seconds
    return () => clearInterval(intervalId);
  }, [refreshAlerts]);

  const unreadCount = useMemo(() => alerts.filter(alert => !alert.checked).length, [alerts]);

  const value = {
    alerts,
    setAlerts,
    loading,
    error,
    unreadCount,
    refreshAlerts,
  };

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts(): AlertsContextType {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
}
