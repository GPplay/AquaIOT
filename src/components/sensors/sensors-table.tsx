'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2, Edit, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { EditSensorDialog } from "./edit-sensor-dialog";
import { getDevices, deleteDevice } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Sensor = { name: string; address: string; macAddress: string; status: 'online' | 'offline' };

const statusConfig: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined, icon: React.ReactNode, label: string } } = {
  online: { variant: 'default', icon: <Wifi className="h-3 w-3" />, label: 'En línea' },
  offline: { variant: 'destructive', icon: <WifiOff className="h-3 w-3" />, label: 'Fuera de línea' },
};

export function SensorsTable({ onDevicesLoaded }: { onDevicesLoaded: (devices: Sensor[]) => void }) {
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDevices();
            const formattedData: Sensor[] = data.map((d: any) => ({ 
                macAddress: d.id, 
                name: d.name,
                address: d.address,
                status: d.status === 'ON' ? 'online' : 'offline'
            }));
            setSensors(formattedData);
            onDevicesLoaded(formattedData);
        } catch (err: any) {
            setError(err.message || "No se pudieron cargar los dispositivos.");
        } finally {
            setLoading(false);
        }
    }, [onDevicesLoaded]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const handleDelete = async (macAddress: string) => {
        try {
            await deleteDevice(macAddress);
            toast({
                title: "Dispositivo Eliminado",
                description: `El dispositivo con MAC ${macAddress} ha sido eliminado.`,
            });
            fetchDevices(); // Refresh list
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error al Eliminar",
                description: err.message,
            });
        }
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispositivos Conectados</CardTitle>
        <CardDescription>Una lista de todos los dispositivos activos e inactivos en la red.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dirección MAC</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
                    </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-destructive py-8">
                    <div className="flex flex-col items-center gap-2">
                        <AlertTriangle className="h-8 w-8" />
                        <p className="font-semibold">Error al cargar los dispositivos</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sensors.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No se han encontrado dispositivos. Añade uno para empezar.
                    </TableCell>
                </TableRow>
              ) : (
                sensors.map((sensor) => (
                    <TableRow key={sensor.macAddress}>
                    <TableCell className="font-mono text-xs">{sensor.macAddress}</TableCell>
                    <TableCell className="font-medium">{sensor.name}</TableCell>
                    <TableCell>{sensor.address}</TableCell>
                    <TableCell>
                        <Badge variant={statusConfig[sensor.status]?.variant || 'secondary'} className="capitalize gap-1.5">
                            {statusConfig[sensor.status]?.icon || <WifiOff className="h-3 w-3" />}
                            {statusConfig[sensor.status]?.label || 'Desconocido'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <EditSensorDialog sensor={sensor} onUpdate={fetchDevices}>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Edit className="mr-2" />
                                            Editar
                                        </DropdownMenuItem>
                                    </EditSensorDialog>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                            <Trash2 className="mr-2" />
                                            Eliminar
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el dispositivo
                                    y todos sus datos asociados.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(sensor.macAddress)}>
                                    Sí, eliminar dispositivo
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
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
