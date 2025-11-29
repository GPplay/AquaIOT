'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2, Edit, Wifi, WifiOff, Tool } from "lucide-react";
import { useState } from "react";

const initialSensors = [
  { id: 'ESP001', name: 'Dispositivo Boca del Río', area: 'Barrio Chino', type: 'Nivel de Agua', status: 'online', last_reading: '4.6m', battery: 95 },
  { id: 'ESP002', name: 'Dispositivo Canal Getsemaní', area: 'Getsemaní', type: 'Nivel de Agua', status: 'online', last_reading: '3.2m', battery: 80 },
  { id: 'ESP003', name: 'Muelle Bocagrande', area: 'Bocagrande', type: 'Mareógrafo', status: 'offline', last_reading: '2.1m', battery: 20 },
  { id: 'ESP004', name: 'Puente El Pozón', area: 'El Pozón', type: 'Caudal', status: 'online', last_reading: '25 m³/s', battery: 100 },
  { id: 'ESP005', name: 'Bahía de Manga', area: 'Manga', type: 'Nivel de Agua', status: 'maintenance', last_reading: '3.5m', battery: 55 },
  { id: 'ESP006', name: 'Laguna del Cabrero', area: 'Marbella', type: 'Salinidad', status: 'online', last_reading: '30 PSU', battery: 72 },
];

const statusConfig: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined, icon: React.ReactNode, label: string } } = {
  online: { variant: 'default', icon: <Wifi className="h-3 w-3" />, label: 'En línea' },
  offline: { variant: 'destructive', icon: <WifiOff className="h-3 w-3" />, label: 'Fuera de línea' },
  maintenance: { variant: 'secondary', icon: <Tool className="h-3 w-3" />, label: 'Mantenimiento' },
};

export function SensorsTable() {
    const [sensors, setSensors] = useState(initialSensors);

    const handleDelete = (id: string) => {
        setSensors(sensors.filter(sensor => sensor.id !== id));
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
                <TableHead>ID del Dispositivo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Batería</TableHead>
                <TableHead>Última Lectura</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell className="font-mono text-xs">{sensor.id}</TableCell>
                  <TableCell className="font-medium">{sensor.name}</TableCell>
                  <TableCell>{sensor.area}</TableCell>
                  <TableCell>{sensor.type}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[sensor.status]?.variant} className="capitalize gap-1.5">
                        {statusConfig[sensor.status]?.icon}
                        {statusConfig[sensor.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{sensor.battery}%</TableCell>
                  <TableCell>{sensor.last_reading}</TableCell>
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
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(sensor.id)}>
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
