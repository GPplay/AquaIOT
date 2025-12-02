'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { getAlerts } from "@/services/api";
import { type Alert } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const riskVariants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined } = {
  LOW: 'secondary',
  MEDIUM: 'default',
  HIGH: 'destructive',
};

export function AlertsTable() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        setError(null);
        const fetchedAlerts = await getAlerts();
        setAlerts(fetchedAlerts);
      } catch (err: any) {
        setError(err.message || "No se pudieron cargar las alertas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas Recientes</CardTitle>
        <CardDescription>Un registro de las alertas de riesgo de inundación recientes emitidas por el sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Alerta</TableHead>
                <TableHead>Nivel de Riesgo</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Área Afectada</TableHead>
                <TableHead>Fecha y Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-destructive py-8">
                    <div className="flex flex-col items-center gap-2">
                        <AlertTriangle className="h-8 w-8" />
                        <p className="font-semibold">Error al cargar las alertas</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : alerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No hay alertas para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">ALRT{String(alert.id).padStart(3, '0')}</TableCell>
                    <TableCell>
                      <Badge variant={riskVariants[alert.level]} className="capitalize">{alert.level.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{alert.device_id}</TableCell>
                    <TableCell>{alert.address}</TableCell>
                    <TableCell>{format(new Date(alert.date), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}