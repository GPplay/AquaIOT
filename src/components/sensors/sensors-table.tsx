'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2, Edit, Wifi, WifiOff, Wrench } from "lucide-react";
import { useState } from "react";

const initialSensors = [
  { name: 'Dispositivo Boca del Río', area: 'Barrio Chino', macAddress: '3C:71:BF:4C:4C:AC', status: 'online' },
  { name: 'Dispositivo Canal Getsemaní', area: 'Getsemaní', macAddress: '84:0D:8E:95:5E:28', status: 'online' },
  { name: 'Muelle Bocagrande', area: 'Bocagrande', macAddress: 'A0:20:A6:10:4E:5A', status: 'offline' },
  { name: 'Puente El Pozón', area: 'El Pozón', macAddress: 'BC:DD:C2:72:A4:9C', status: 'online' },
  { name: 'Bahía de Manga', area: 'Manga', macAddress: '40:F5:20:41:A7:B0', status: 'maintenance' },
  { name: 'Laguna del Cabrero', area: 'Marbella', macAddress: 'CC:50:E3:8A:A8:B4', status: 'online' },
];

const statusConfig: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined, icon: React.ReactNode, label: string } } = {
  online: { variant: 'default', icon: <Wifi className="h-3 w-3" />, label: 'En línea' },
  offline: { variant: 'destructive', icon: <WifiOff className="h-3 w-3" />, label: 'Fuera de línea' },
  maintenance: { variant: 'secondary', icon: <Wrench className="h-3 w-3" />, label: 'Mantenimiento' },
};

export function SensorsTable() {
    const [sensors, setSensors] = useState(initialSensors);

    const handleDelete = (macAddress: string) => {
        setSensors(sensors.filter(sensor => sensor.macAddress !== macAddress));
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
                <TableHead>Nombre</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Dirección MAC</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow key={sensor.macAddress}>
                  <TableCell className="font-medium">{sensor.name}</TableCell>
                  <TableCell>{sensor.area}</TableCell>
                  <TableCell className="font-mono text-xs">{sensor.macAddress}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[sensor.status]?.variant} className="capitalize gap-1.5">
                        {statusConfig[sensor.status]?.icon}
                        {statusConfig[sensor.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="mr-2" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(sensor.macAddress)}>
                                <Trash2 className="mr-2" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
